const Customers = () => {
  return (
    <>
      <h1>Customers</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>John</td>
            <td>john@mail.com</td>
            <td>Active</td>
            <td><button>Block</button></td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default Customers;
