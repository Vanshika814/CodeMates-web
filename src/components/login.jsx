import React, { useState } from "react";
import {Card, CardBody, Form, Input, Button, CardHeader} from "@heroui/react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router";
import {BASE_URL} from "../utils/constants";

export default function App() {
    const [emailId, setEmailId] = React.useState("agarwal78@gmail.com");
    const [password, setpassword] = React.useState("Lakshit@123");
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async () => {
     
        try{
            const res = await axios.post(BASE_URL + "/login", {
                emailId,
                password,
            }, { withCredentials: true });
            console.log("Login response:", res.data);
            dispatch(addUser(res.data));
            navigate("/");


            } catch(err){
              setError(err?.response?.data || "Something went wrong");
        }
    };
  return (
    <Card className="max-w-sm mx-auto my-16">
         <CardHeader className="flex justify-center text-2xl font-bold">
        Login
      </CardHeader>
      <CardBody className="flex justify-center items-center">
        <Form
        className="w-full max-w-xs flex flex-col items-center gap-4"
        >
        <Input
            isRequired
            errorMessage="Please enter a valid email"
            label="Email"
            labelPlacement="outside"
            name="Email"
            placeholder="Enter your email"
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
            className="w-full"
        />

        <Input
            isRequired
            errorMessage="Please enter a valid password"
            label="Password"
            labelPlacement="outside"
            name="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            className="w-full"
        />
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div className="flex justify-center w-full gap-3">
            <Button color="secondary" onPress={handleLogin}>
            Login
            </Button>
        </div>
        </Form>
      </CardBody>
    </Card>
  );
}

