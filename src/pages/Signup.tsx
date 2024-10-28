import { Link, useNavigate } from "react-router-dom";
import { TERipple } from "tw-elements-react";
import { signUpSchema } from "../Types/Schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "../lib/axios";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { z } from "zod";
import { useEffect } from "react";

export default function Signup(): JSX.Element {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
  });
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => {
        if (error && error.message) {
          toast.error(error.message, { position: "top-left" });
        }
      });
    }
  }, [errors]);
  async function submitData(data: z.infer<typeof signUpSchema>) {
    try {
      console.log("data", data);
      const responses = await axiosInstance.post("/api/signUp", {
        data,
      });

      console.log(responses); 

      if (responses) {
        toast.success("Register Successfully", {
          position: "top-center",
        });

        navigate("/login");
      }
    } catch (error) {
      console.log("asfdsd", error);

      toast.error("Alread a user", {
        position: "top-center",
      });
    }
    console.log("IT WORKED", data);
  }

  return (
    <section className="h-screen w-[90%] ">
      <div className="h-full">
        {/* <!-- Left column container with background--> */}
        <div className="g-6 flex h-full flex-wrap items-center justify-center lg:justify-between">
          <div className="shrink-1 mb-12 grow-0 basis-auto md:mb-0 md:w-9/12 md:shrink-0 lg:w-6/12 xl:w-6/12">
            <img
              src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="w-full"
              alt="Sample image"
            />
          </div>
          {/* <!-- Right column container --> */}
          <div className="mb-12 md:mb-0 md:w-8/12 lg:w-5/12 xl:w-5/12">
            <form onSubmit={handleSubmit(submitData)}>
              {/* <!--Sign in section--> */}
              <div className="flex flex-row items-center justify-center lg:justify-start">
                <p className="mb-0 mr-4 text-lg">Signup in with</p>

                {/* <!-- Facebook button--> */}
                <TERipple rippleColor="light">
                  <button
                    type="button"
                    className="mx-1 h-9 w-9 rounded-full bg-primary uppercase leading-normal text-black shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                  >
                    {/* <!-- Facebook --> */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mx-auto h-3.5 w-3.5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                    </svg>
                  </button>
                </TERipple>

                {/* <!-- Twitter button --> */}
                <TERipple rippleColor="light">
                  <button
                    type="button"
                    className="mx-1 h-9 w-9 rounded-full bg-primary uppercase leading-normal text-black shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                  >
                    {/* <!-- Twitter --> */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mx-auto h-3.5 w-3.5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </button>
                </TERipple>

                {/* <!-- Linkedin button --> */}
                <TERipple rippleColor="light">
                  <button
                    type="button"
                    className="mx-1 h-9 w-9 rounded-full bg-primary uppercase leading-normal text-black shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                  >
                    {/* <!-- Linkedin --> */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mx-auto h-3.5 w-3.5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                    </svg>
                  </button>
                </TERipple>
              </div>

              {/* <!-- Separator between social media sign in and email/password sign in --> */}
              <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
                <p className="mx-4 mb-0 text-center font-semibold dark:text-black">
                  Or
                </p>
              </div>

              {/* <!-- Email input --> */}
              <input
                className={`mb-6 w-full border border-black p-2 ${
                  errors.fullname
                    ? "focus-visible:ring-red-500 outline outline-red-500"
                    : ""
                }  rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600`}
                type="text"
                placeholder="Name"
                {...register("fullname")}
              />

              <input
                className={`mb-6 w-full border border-black p-2 ${
                  errors.email
                    ? "focus-visible:ring-red-500 outline outline-red-500"
                    : ""
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600`}
                type="text"
                placeholder="Email"
                {...register("email")}
              />

              {/* <!--Password input--> */}
              <input
                className={`mb-6 w-full border border-black p-2 ${
                  errors.password
                    ? "focus-visible:ring-red-500 outline outline-red-500"
                    : ""
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600`}
                type="password"
                placeholder="Password"
                {...register("password")}
              />
              <input
                className={`mb-6 w-full border border-black p-2 ${
                  errors.confirmPassword
                    ? "focus-visible:ring-red-500 outline outline-red-500"
                    : ""
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600`}
                type="password"
                placeholder="Confirm Password"
                {...register("confirmPassword")}
              />

              <div className="mb-6 flex items-center justify-between">
                {/* <!--Forgot password link--> */}
                <p>Forgot password?</p>
              </div>

              {/* <!-- Login button --> */}
              <div className="text-center lg:text-left">
                <button
                  className="inline-block rounded bg-blue-500 px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 active:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-600 dark:active:bg-blue-600"
                  type="submit"
                >
                  SIGN-UP
                </button>

                {/* <!-- Register link --> */}
                <Link to="/login" className="hover:underline">
                  <p className="mb-0 mt-2 pt-1 text-sm font-semibold flex">
                    Have an account ?.
                    <span className="text-danger transition duration-150 ease-in-out hover:text-danger-600 focus:text-danger-600 active:text-danger-700">
                      get in
                    </span>
                  </p>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
