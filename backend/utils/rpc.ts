import axios from "axios";

export const RPC = async (method: string, parameter: any) => {
  const USER = "test";
  const PASS = "test";
  const RegTest = 18443;
  const TestNet = 18332;
  const SigNet = 38332;
  const RPC_URL = `http://127.0.0.1:${TestNet}/`;
  const body = {
    jsonrpc: "1.0",
    id: "curltext",
    method: method,
    params: parameter,
  };

  try {
    const response = await axios.post(RPC_URL, JSON.stringify(body), {
      auth: {
        username: USER,
        password: PASS,
      },
    });

    return response.data;
  } catch (error: any) {
    throw error;
  }
};
