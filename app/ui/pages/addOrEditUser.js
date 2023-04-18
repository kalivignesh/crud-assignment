import React, { useEffect, useState } from 'react';
import { Dropdown, Modal, ModalBody } from 'react-bootstrap';
import '../styles/model.css';
import '../styles/home.css';

import makeGetRequest from '../api/getApi';

function QuestionDetails({
  show,
  handleClosed,
  data,

  setData,
  mode,
}) {
  const adduser = async () => {
    data.name !== '' &&
      data.email !== '' &&
      data.contactNo !== '' &&
      data.location !== '' &&
      (await makeGetRequest('POST', `/user`, {
        name: data.name,
        email: data.email,

        contactNo: data.contactNo,
        location: data.location,
      }));
    handleClosed();
  };
  const EditUser = async () => {
    await makeGetRequest('PATCH', `/update/${data.id}`, {
      name: data.name,
      email: data.email,

      contactNo: data.contactNo,
      location: data.location,
    });
    handleClosed();
  };
  return (
    <Modal
      style={{
        paddingRight: '0px',
        position: 'absolute',
        top: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        border: 'none',
        outline: 'none',
      }}
      show={show}
      onHide={() => {}}
      centered
    >
      <div className="modelHead">
        {console.log(data)}
        <div className="modelcont">
          <div className="addUserText">
            <div>Add User</div>
          </div>
          <div className="nameFlex">
            <div className="nameText">Name</div>
            <input
              onChange={e => {
                setData({ ...data, ['name']: e.target.value });
              }}
              value={data.name}
              className="input"
            />
          </div>
          <div className="nameFlex">
            <div className="nameText">Email</div>
            <input
              onChange={e => {
                setData({ ...data, ['email']: e.target.value });
              }}
              value={data.email}
              className="input"
            />
          </div>

          <div className="nameFlex">
            <div className="nameText">Contact no</div>
            <input
              onChange={e => {
                setData({ ...data, ['contactNo']: e.target.value });
              }}
              value={data.contactNo}
              className="input"
            />
          </div>
          <div className="nameFlex">
            <div className="nameText">Location</div>
            <input
              onChange={e => {
                setData({ ...data, ['location']: e.target.value });
              }}
              value={data.location}
              className="input"
            />
          </div>

          <div className="addUserText">
            <button
              className="addUserButton"
              onClick={() => {
                handleClosed();
              }}
            >
              Cancel
            </button>
            {mode === 'add' ? (
              <button
                className="addUserButton"
                style={{
                  background:
                    data.name === '' ||
                    data.email === '' ||
                    data.contactNo === '' ||
                    data.location === ''
                      ? 'grey'
                      : '#DF44C9',
                }}
                onClick={() => {
                  adduser();
                }}
              >
                Add User
              </button>
            ) : (
              <button
                className="addUserButton"
                onClick={() => {
                  EditUser();
                }}
              >
                Edit User
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default QuestionDetails;
