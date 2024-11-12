import React,{useState} from "react";

const AddPartInfo =() =>{

  const [formData,setFormData]=useState({
    part_name: '',
    category:'',
    quantity:'',
    supplier_name:'',
    price:''
  });

  const handleChange=(e)=>{
    const {name,value}=e.target;
    setFormData({...formData,[name]:value});
    console.log(formData);
  }
  
  const handleSubmit = async(e)=>{
    e.preventDefault();
    try{
    const response =await fetch('http://localhost:3000/inventory/adduser',{
      method:"POST",
      headers:{
        'content-type':'application/json',
      },
      body:JSON.stringify(formData),
    });
    if(response.ok)
    {
      const responseData=await response.json();
      handleCancel();
      alert("data added successfully");
    }
    else
    {
      const errorData = await response.json();
          alert(`Error submitting data: ${errorData.error}`);
    }
  }
  catch(err)
  {
    alert(err);
  }
  };

  const handleCancel = () =>{
    setFormData({
      part_name: '',
      category:'',
      quantity:'',
      supplier_name:'',
      price:''
    })
  }
  return(
    <div className="form-container">
      <h3>Add new Parts</h3>
      <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Part-Name</label>
        <input type="text"  name="part_name" value={formData.part_name} onChange={handleChange} required/>
      </div>
      <div className="form-group">
        <label>Category</label>
        <input type="text" name="category" value={formData.category} onChange={handleChange} required/>
      </div>
      <div className="form-group">
        <label>Quantity</label>
        <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Suppleir-Name</label>
        <input type="text" name="supplier_name" value={formData.supplier_name} onChange={handleChange}/>
      </div>
      <div className="form-group ">
        <label>Price</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange}/>
      </div>
      <div className="form-buttons">
        <button type="submit" className="save-btn">Save</button>
        <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
      </div>
      </form>

    </div>
  )
}

export default AddPartInfo;