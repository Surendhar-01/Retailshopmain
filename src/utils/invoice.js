import { formatCurrency, formatDateTime } from './formatters';
import { printHtmlDocument } from './export';

export const printInvoice = ({ bill, shop }) => {
  const rows = bill.items
    .map(
      (item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${item.name}</td>
          <td>${item.quantity} ${item.unit}</td>
          <td>${formatCurrency(item.price)}</td>
          <td>${formatCurrency(item.lineTotal)}</td>
        </tr>
      `,
    )
    .join('');

  const html = `
    <h1>${shop.name}</h1>
    <p>${shop.address}</p>
    <p>GSTIN: ${shop.gstin}</p>
    <p>Invoice #: ${bill.invoiceNumber}</p>
    <p>Date: ${formatDateTime(bill.date)}</p>
    <p>Customer: ${bill.customerName || 'Walk-in Customer'}</p>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Item</th>
          <th>Qty</th>
          <th>Rate</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="totals">
      <div><strong>Subtotal</strong><span>${formatCurrency(bill.subtotal)}</span></div>
      <div><strong>GST</strong><span>${formatCurrency(bill.gstAmount)}</span></div>
      <div><strong>Total</strong><span>${formatCurrency(bill.total)}</span></div>
    </div>
  `;

  printHtmlDocument(`Invoice-${bill.invoiceNumber}`, html);
};
