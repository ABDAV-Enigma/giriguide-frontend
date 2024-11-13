import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { keepLogin, login } from "../../redux/feature/authSlice";
import { useNavigate } from "react-router";
import InputPassword from "../../components/InputPassword";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const token = useSelector((state) => state.auth.token);
  let status = useSelector((state) => state.auth.status);
  const error = useSelector((state) => state.auth.error);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const role = useSelector((state) => state.auth.role);
  const userId = useSelector((state) => state.auth.userId);
  const emailUser = useSelector((state) => state.auth.email);
  const [errorMessage, setErrorMessage] = useState("");
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  useEffect(() => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setIsEmailValid(email ? emailRegex.test(email) : true);
  }, [email]);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Email and password are required");
      onOpen();
      return;
    }
    if (!isEmailValid) {
      return;
    }
    dispatch(login({ email, password }));
  };

  useEffect(() => {
    const getKeepLogin = async () => {
      const role = localStorage.getItem("role");
      if (role !== "ROLE_ADMIN") {
        return;
      }
      const token = localStorage.getItem("token");
      const jwt = jwtDecode(token);
      const isTokenExpired = jwt.exp < Date.now() / 1000;

      console.log("Decoded", jwt.exp);
      console.log("Is expired", token, isTokenExpired, Date.now()), jwt.exp;
      const condition = token && !isTokenExpired;
      if (condition) {
        dispatch(keepLogin(token));
      }
    };
    getKeepLogin();
  }, []);

  useEffect(() => {
    if (isLoggedIn && role === "ROLE_ADMIN") {
      localStorage.setItem("token", token);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userId", userId);
      localStorage.setItem("email", emailUser);
      localStorage.setItem("role", role);
      console.log(
        "token",
        token,
        "isLoggedIn",
        isLoggedIn,
        "userId",
        userId,
        "email",
        emailUser,
        "role",
        role,
        "emailUser",
        emailUser,
        "status",
        status
      );
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate, token]);

  useEffect(() => {
    if (status === "failed") {
      setErrorMessage(error);
      onOpen();
    }
  }, [status]);

  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen">
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Error</ModalHeader>
              <ModalBody>
                <p className="text-error">{errorMessage}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="flex flex-col gap-4 justify-center items-center h-[400px] px-4 py-2 rounded-2xl bg-[#fefefe] w-96">
        <h3 className="text-3xl font-bold">Login as a admin</h3>
        <section className="w-full">
          <Input
            key="bordered"
            type="email"
            label="Email"
            variant="bordered"
            isInvalid={!isEmailValid}
            color={!isEmailValid ? "danger" : "success"}
            errorMessage="Email Invalid"
            onValueChange={setEmail}
          />
        </section>
        <section className="w-full">
          <InputPassword
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
            // isInvalid={!isPasswordValid}
            // color={!isPasswordValid ? "danger" : "success"}
            // errorMessage="Password Invalid ( minimal 8 character , uppercase , lowercase ,
            // number , special character)"
          />
        </section>
        <Button
          className={` px-5 py-2 rounded-md text-bgLight font-bold w-full ${
            !isEmailValid
              ? "bg-successfulSecondary text-neutral-900"
              : "bg-successful hover:bg-successfulHover"
          }`}
          onClick={handleLogin}>
          Login
        </Button>
      </div>
    </div>
  );
};

export default Login;
