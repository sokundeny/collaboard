  import React, { useState } from 'react';
  import useAuth from '../hooks/useAuth';
  import {loginApi,registerApi} from "../services/authService"
  import {useNavigate} from "react-router-dom"

  const LoginPage = () => {
    const navigate=useNavigate()
    const [login, setLogin] = useState(true);
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
    });
    const [error,setError]=useState("")
    const {loginUser}=useAuth()

    const handleChange=(e)=>{
      const {name,value}=e.target
      setFormData((prev)=>({...prev,[name]:value}))
    }


    const handleSubmit = async (e) => {
      try {
        if (login) {
          const data = await loginApi(formData);
          loginUser(data.token); // call context login
          navigate("/")
        } else {
          const data = await registerApi(formData);
          loginUser(data.token); // auto-login after register
          navigate("/")
        }
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
      }
    };

    const handleClick = (type) => {
      setLogin(type === 'login');
    };

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#2D3142] text-white space-y-6">

        {/* Toggle Switch */}
        <div className="relative w-64 h-12 bg-gray-500 rounded-3xl overflow-hidden">
          <div
            className={`absolute top-0 h-full w-1/2 bg-[#FCA311] rounded-3xl transition-all duration-500 ease-in-out ${login ? 'left-0' : 'left-1/2'}`}
          ></div>

          <div className="relative z-10 flex w-full h-full font-bold">
            <button
              onClick={() => handleClick("login")}
              className="w-1/2 h-full z-20"
            >
            Login In
            </button>
            <button
              onClick={() => handleClick("signup")}
              className="w-1/2 h-full z-20"
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Input Group */}
        <div className="w-64 h-80 flex flex-col space-y-10 justify-between pt-6">
              <div className="flex flex-col space-y-3 l">
                  <div className="flex flex-col">
                      <label htmlFor="email" className="text-[#FCA311] text-sm font-medium">
                          Email:
                      </label>
                      <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Please input email"
                          className="px-3 py-2 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                      />
                  </div>

                      {/* Password (always shown) */}
                  <div className="flex flex-col">
                      <label htmlFor="password" className="text-[#FCA311] text-sm font-medium">
                          Password:
                      </label>
                      <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Please input password"
                          className="px-3 py-2 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                      />
                  </div>
                      {!login && (
                          <div className="flex flex-col">
                              <label htmlFor="name" className="text-[#FCA311] text-sm font-medium">
                              Name:
                              </label>
                              <input
                              type="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Please input name"
                              className="px-3 py-2 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                              />
                          </div>
                      )}
              </div>

              {error&&<p className='text-red-600'>{error}</p>}
              <div className="">
                  <button className="w-full mt-2 py-2 bg-[#FCA311] text-white rounded font-bold hover:bg-yellow-500 transition" onClick={handleSubmit}>
                      {login ? 'Login' : 'Sign Up'}
                  </button>
              </div>
        </div>
      </div>
    );
  };

  export default LoginPage;
