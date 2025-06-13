import { faker } from '@faker-js/faker';
import { invoiceFieldsTable, invoiceItemsTable, invoicesTable, usersTable } from '~/database';
import { hashPassword } from '~/lib/auth';
import { db } from '~/lib/db';

await db.delete(invoicesTable);
await db.delete(usersTable);

const users = await db
  .insert(usersTable)
  .values(
    await Promise.all(
      Array.from({ length: 3 }, async (_, i) => ({
        email: `user${i}@example.com`,
        passwordHash: await hashPassword(`Secret.${i}`),
      })),
    ),
  )
  .returning({ id: usersTable.id });

const currencyCodes = ['EUR', 'USD', 'GBP', 'CHF', 'JPY', 'AUD', 'CAD'];
const units = ['pcs', 'hrs'] as const;

for (const { id: userId } of users) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const from = `${firstName} ${lastName}`;
  const fromEmail = faker.internet.email({ firstName, lastName });
  const fromPhone = faker.phone.number();
  const fromCountry = faker.location.country();
  const fromIBAN = faker.finance.iban();
  const fromBankName = faker.company.name();

  // generate between 2 and 5 series
  const userSeries = Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () =>
    faker.string.alphanumeric({ length: 3, casing: 'upper' }),
  );
  // for each series, generate a random starting number
  const seriesStartingNumbers = userSeries.map(() => faker.number.int({ min: 1, max: 9999 }));

  // generate between 200 and 250 invoices per user
  for (let i = 0; i < faker.number.int({ min: 200, max: 250 }); i++) {
    const series = faker.helpers.arrayElement(userSeries);
    const number = seriesStartingNumbers[userSeries.indexOf(series)]++;
    const currencyCode = faker.helpers.arrayElement(currencyCodes);
    const issueDate = faker.date.past();
    const dueDate = faker.date.soon({ refDate: issueDate, days: 30 });

    // start transaction
    await db.transaction(async (db) => {
      // create invoice
      const [{ id: invoiceId }] = await db
        .insert(invoicesTable)
        .values({
          userId,
          from,
          to: faker.company.name(),
          series,
          number,
          currencyCode,
          issueDate: issueDate.toJSON().substring(0, 10),
          dueDate: dueDate.toJSON().substring(0, 10),
          status: faker.helpers.arrayElement(invoicesTable.status.enumValues),
        })
        .returning({ id: invoicesTable.id });

      // create invoice fields
      let fFieldIndex = 0;
      let tFieldIndex = 0;

      // "FROM"
      if (faker.datatype.boolean({ probability: 0.8 })) {
        await db
          .insert(invoiceFieldsTable)
          .values({ invoiceId, index: fFieldIndex++, type: 'from', name: 'Email', value: fromEmail });
      }
      if (faker.datatype.boolean({ probability: 0.8 })) {
        await db
          .insert(invoiceFieldsTable)
          .values({ invoiceId, index: fFieldIndex++, type: 'from', name: 'Phone', value: fromPhone });
      }
      if (faker.datatype.boolean({ probability: 0.8 })) {
        await db
          .insert(invoiceFieldsTable)
          .values({ invoiceId, index: fFieldIndex++, type: 'from', name: 'Country', value: fromCountry });
      }
      await db
        .insert(invoiceFieldsTable)
        .values({ invoiceId, index: fFieldIndex++, type: 'from', name: 'IBAN', value: fromIBAN });
      if (faker.datatype.boolean()) {
        await db
          .insert(invoiceFieldsTable)
          .values({ invoiceId, index: fFieldIndex++, type: 'from', name: 'Bank Name', value: fromBankName });
      }
      // "TO"
      if (faker.datatype.boolean({ probability: 0.8 })) {
        await db
          .insert(invoiceFieldsTable)
          .values({ invoiceId, index: tFieldIndex++, type: 'to', name: 'Email', value: faker.internet.email() });
      }
      if (faker.datatype.boolean({ probability: 0.8 })) {
        await db
          .insert(invoiceFieldsTable)
          .values({ invoiceId, index: tFieldIndex++, type: 'to', name: 'Phone', value: faker.phone.number() });
      }
      if (faker.datatype.boolean({ probability: 0.8 })) {
        await db.insert(invoiceFieldsTable).values({
          invoiceId,
          index: tFieldIndex++,
          type: 'to',
          name: 'Country',
          value: faker.location.country(),
        });
      }
      await db
        .insert(invoiceFieldsTable)
        .values({ invoiceId, index: tFieldIndex++, type: 'to', name: 'IBAN', value: faker.finance.iban() });
      if (faker.datatype.boolean()) {
        await db
          .insert(invoiceFieldsTable)
          .values({ invoiceId, index: tFieldIndex++, type: 'to', name: 'Bank Name', value: faker.company.name() });
      }

      // create invoice items
      await db.insert(invoiceItemsTable).values(
        Array.from({ length: faker.number.int({ min: 5, max: 20 }) }, (_, index) => {
          const unit = faker.helpers.arrayElement(units);
          const quantity =
            unit === 'hrs'
              ? faker.number.float({ min: 1, max: 10, multipleOf: 0.25 })
              : faker.number.int({ min: 1, max: 10 });
          return {
            invoiceId,
            index,
            description: faker.commerce.productName(),
            unit,
            unitPrice: faker.number.float({ min: 10, max: 100, fractionDigits: 2 }),
            quantity,
          };
        }),
      );
    });
  }
}
