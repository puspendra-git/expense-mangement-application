import React, { useState, useEffect, useCallback } from "react";
import { Modal, Form, Select, Input, message, Table, DatePicker } from "antd";
import {UnorderedListOutlined, AreaChartOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons'
import Layout from "../components/layout/Layout";
import axios from "axios"; // Correctly importing axios

import Spinner from "../components/Spinner";
import moment from "moment";
import Analytics from "../components/Analytics";



const { RangePicker } = DatePicker;

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransection, setAllTransection] = useState([]);
  const [frequency, setFrequency] = useState('7');
  const [selectedDate, setSelectdate] = useState([]);
  const [type, setType] = useState("all"); // Add state for type filter
  const [viewData, setViewData] = useState('table');
  const [editable,setEditable] = useState(null)



  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => <span>{moment(text).format('YYYY-MM-DD')}</span>
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Reference",
      dataIndex: "reference",
    },
    {
      title: "Actions",
      render : (text ,record) => (
        <div>
          <EditOutlined onClick={()=>{
            setEditable(record)
            setShowModal(true)

          }}/>
          <DeleteOutlined className="mx-2" onClick={() =>{
            handleDelete(record);
          }}  />

        </div>
      )
    }
  ];

  // Fetch transactions
  const getAllTransactions = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      const res = await axios.post("/transections/get-transection", {
        userid: user._id,
        frequency,
        selectedDate,
        type, // Add type to the API request
      });

      setLoading(false);
      setAllTransection(res.data);
    } catch (error) {
      setLoading(false);
      console.error(error);
      message.error("Fetch Issue With Transaction");
    }
  }, [frequency, selectedDate, type]); // Add type as a dependency

  // Call getAllTransactions when frequency or selectedDate changes
  useEffect(() => {
    getAllTransactions();
  }, [getAllTransactions]);


// delete handler

const handleDelete =async (record) => {
    try {
      setLoading(true)
      await axios.post("/transections/delete-transection", { transacationId: record._id });

      setLoading(false)
      message.success("Transaction Deleted!");
    } catch (error) {
        setLoading(false)
        console.log(error)
        message.error('unable to delete')
    }
}



  // Handle form submission for adding new transaction
  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      
      if(editable){
        await axios.post("/transections/edit-transection", {
         payload:{
          ...values,
          userid: user._id,
         },
         transacationId: editable._id
        });
        setLoading(false);
        message.success("Transaction Added Successfully");

      }else{
        await axios.post("/transections/add-transection", {
          ...values,
          userid: user._id,
        });
        setLoading(false);
        message.success("Transaction Added Successfully");
      }


      setShowModal(false);
      setEditable(null);
      getAllTransactions(); // Refresh data after form submission
    } catch (error) {
      setLoading(false);
      console.error(error);
      message.error("Failed to add transaction");
    }
  };

  return (
    <Layout>
      {loading && <Spinner />}
      <div className="filters">
        <div>
          <h6>Select Frequency</h6>
          <Select value={frequency} onChange={(values) => setFrequency(values)}>
            <Select.Option value="7">LAST 1 Week</Select.Option>
            <Select.Option value="30">LAST 1 Month</Select.Option>
            <Select.Option value="365">LAST 1 Year</Select.Option>
            <Select.Option value="custom">Custom</Select.Option>
          </Select>
          {frequency === "custom" && (
            <RangePicker value={selectedDate} onChange={(values) => setSelectdate(values)} />
          )}
        </div>

        <div>
          <h6>Select Type</h6>
          <Select value={type} onChange={(value) => setType(value)}>
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="income">Income</Select.Option>
            <Select.Option value="expense">Expense</Select.Option>
          </Select>
        </div>
        <div className="switch-icons">
  <UnorderedListOutlined
    className={`mx-2 ${viewData === 'table' ? 'active-icon' : 'inactive-icon'}`}
    onClick={() => setViewData('table')}
  />
  <AreaChartOutlined
    className={`mx-2 ${viewData === 'analytics' ? 'active-icon' : 'inactive-icon'}`}
    onClick={() => setViewData('analytics')}
  />
</div>

        <div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Add New
          </button>
        </div>
      </div>

      <div className="content">
        {viewData === 'table' ?  
           <Table columns={columns} dataSource={allTransection} />
           : <Analytics allTransection = {allTransection}  />
      }
       
      </div>

      <Modal
  title={editable ? 'Edit Transaction' : "Add Transaction"}
  open={showModal}
  onCancel={() => setShowModal(false)}
  footer={false}
>
  <Form layout="vertical" onFinish={handleSubmit} initialValues={editable}>
    <Form.Item
      label="Amount"
      name="amount"
      rules={[{ required: true, message: "Amount is required" }]}
    >
      <Input type="text" />
    </Form.Item>
    <Form.Item
      label="Type"
      name="type"
      rules={[{ required: true, message: "Type is required" }]}
    >
      <Select>
        <Select.Option value="income">Income</Select.Option>
        <Select.Option value="expense">Expense</Select.Option>
      </Select>
    </Form.Item>
    <Form.Item
      label="Category"
      name="category"
      rules={[{ required: true, message: "Category is required" }]}
    >
      <Select>
        <Select.Option value="salary">Salary</Select.Option>
        <Select.Option value="tip">Tip</Select.Option>
        <Select.Option value="project">Project</Select.Option>
        <Select.Option value="food">Food</Select.Option>
        <Select.Option value="movie">Movie</Select.Option>
        <Select.Option value="bills">Bills</Select.Option>
        <Select.Option value="medical">Medical</Select.Option>
        <Select.Option value="fee">Fee</Select.Option>
        <Select.Option value="tax">Tax</Select.Option>
      </Select>
    </Form.Item>
    <Form.Item
      label="Date"
      name="date"
      rules={[{ required: true, message: "Date is required" }]}
    >
      <Input type="date" />
    </Form.Item>
    <Form.Item
      label="Reference"
      name="reference"
      rules={[{ required: true, message: "Reference is required" }]}
    >
      <Input type="text" />
    </Form.Item>
    <Form.Item
      label="Description"
      name="description"
      rules={[{ required: true, message: "Description is required" }]} // Added required rule
    >
      <Input type="text" />
    </Form.Item>
    <div className="d-flex justify-content-end">
      <button type="submit" className="btn btn-primary">
        SAVE
      </button>
    </div>
  </Form>
</Modal>

    </Layout>
  );
};

export default HomePage;
