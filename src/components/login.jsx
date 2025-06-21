import React, { useState } from "react";
import {Card, CardBody, Form, Input, Button, CardHeader} from "@heroui/react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router";
import {BASE_URL} from "../utils/constants";

export default function App() {
    const [emailId, setEmailId] = React.useState("");
    const [password, setpassword] = React.useState("");
    const [FirstName, setFirstName] = React.useState("");
    const [LastName, setLastName] = React.useState("");
    const [isLoginform, setIsLoginform] = React.useState(true);
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
            return navigate("/");


            } catch(err){
              setError(err?.response?.data || "Something went wrong");
        }
    };

    const handleSignUp = async () => {
      try{

        const res = await axios.post(BASE_URL + "/signup", {
          FirstName,
          LastName,
          emailId,
          password,
        }, {withCredentials: true});
        console.log(res.data.data);
        dispatch(addUser(res.data.data));
        return navigate("/profile");

      } catch(err) {
        setError(err?.response?.data || "Something went wrong");
      }

    }



  return (
    <Card className="max-w-sm mx-auto my-16">
         <CardHeader className="flex justify-center text-2xl font-bold">
        {isLoginform ? "login" : "SignUp"}
      </CardHeader>
      <CardBody className="flex justify-center items-center">
        <Form
        className="w-full max-w-xs flex flex-col items-center gap-4"
        >
          {!isLoginform && (
          <>
          <Input
            isRequired
            errorMessage="Please enter a valid First Name"
            label="First Name"
            labelPlacement="outside"
            name="FirstName"
            placeholder="Enter your First Name"
            value={FirstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full"
        />
        <Input
            isRequired
            errorMessage="Please enter a valid Last Name"
            label="Last Name"
            labelPlacement="outside"
            name="LastName"
            placeholder="Enter your Last Name"
            value={LastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full"
        />
        </>
        )}
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
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            className="w-full"
        />
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div className="flex justify-center w-full gap-3">
            <Button color="secondary" onPress={isLoginform ? handleLogin : handleSignUp}>
            {isLoginform ? "Login" : "SignUp"}
            </Button>
        </div>
        <p className="cursor-pointer" onClick={() => setIsLoginform((value) => !value)}>
          {isLoginform ? 
        "Don't have an account? SignUp here" : 
        "Already have an account ? Login here"}
        </p>
        </Form>
      </CardBody>
    </Card>
  );
}

