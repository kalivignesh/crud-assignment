const url = 'http://localhost:3000/api';

const NO_CONTENT = 204;

const getToken = () => 'JWT ' + window.localStorage.getItem('Authorization');

const makeGetRequest = async (method, endPoint, data) => {
  try {
    let reqBody = {
      method: method,
    };
    if (method == 'POST' || method == 'PATCH') {
      reqBody.headers = {
        'Content-Type': 'application/json',
      };
      reqBody.body = JSON.stringify(data);
    }

    let response = await fetch(`${url}${endPoint}`, reqBody);

    if (response.status === 401 || response.status === 403) {
      // throw new Error('unauthorized')
    }
    let result;
    if (response.status == 201 || response.status == 200) {
      return (result = response.json());
    }
  } catch (error) {
    return {
      error,
      response: null,
    };
  }
};

export default makeGetRequest;
