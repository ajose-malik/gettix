const NewTicket = () => {
	return (
		<div>
			<h1>Create a Ticket</h1>
      <form action="">
        <div className="form-group">
          <label>Title</label>
          <input className="form-control" type="text" />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input className="form-control" type="text" />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
		</div>
	)
}

export default NewTicket
