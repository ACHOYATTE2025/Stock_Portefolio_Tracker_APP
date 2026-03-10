function WalletCard({ balance }) {

  return (

    <div style={{
      border:"1px solid #ccc",
      padding:"20px",
      margin:"20px",
      width:"200px"
    }}>

      <h3>Wallet</h3>

      <p>${balance}</p>

    </div>

  );

}

export default WalletCard;