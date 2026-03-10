function PortfolioTable({ stocks }) {

  return (

    <table border="1">

      <thead>
        <tr>
          <th>Symbol</th>
          <th>Name</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
      </thead>

      <tbody>

        {stocks.map((stock) => (

          <tr key={stock.stockSymbol}>

            <td>{stock.stockSymbol}</td>

            <td>{stock.stockName}</td>

            <td>{stock.quantity}</td>

            <td>{stock.currentPrice}</td>

            <td>{stock.amount}</td>

          </tr>

        ))}

      </tbody>

    </table>

  );

}

export default PortfolioTable;