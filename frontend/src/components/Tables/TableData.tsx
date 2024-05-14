//import { BsDisplay } from "react-icons/bs";

// import React from 'react'
const data = [
    { name: "Abhishek Kumar", Department:"Support Team", time: " 9:13 - 6:00", Avail: " 10(6CL, 4SL)", occasion:"Birthday 🎂" , date:"5-04-2024" , leave:"Casual Leave", Manager:"Chanchal Singh"},
    { name: "Sumit Kumar", Department: "Technical Department", time: " 9:05 - 6:00", Avail: " 5(3CL, 2SL)",occasion:"Birthday 🎂", date:"11-04-2024", leave:"Casual Leave", Manager:"Rahul Singh"},
    { name: "Subham", Department: "Support Team", time: " 9:05 - 6:00", Avail: " 10(6CL, 4SL)",occasion:"Work Anniversary 💻", date:"20-04-2024", leave:"Casual Leave", Manager:"Rahul Singh"},
]

const TableData = () => {
    return (
    <div className="alltable">
        <div className="table" style={{display:"flex",gap:"20px",marginBottom:"20px"}}>
            <div className="first">
                <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                        Employee  Punch details
                    </h4>
  
        <div className="flex flex-col">
          <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-3">
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase ">
              Employee Name
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase ">
              Department
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase ">
              Punch time
              </h5>
            </div>
            
          </div>
  
          {data.map((val, key) => (
            <div
              className={`grid grid-cols-3 sm:grid-cols-3 ${
                key === data.length - 1
                  ? ''
                  : 'border-b border-stroke dark:border-strokedark'
              }`}
              key={key}
            >
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                <div className="flex-shrink-0">
                  {/* <img src={data.logo} alt="Brand" /> */}
                </div>
                <p className="hidden text-black dark:text-white sm:block text-sm">
                  {val.name}
                </p>
              </div>
  
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-black dark:text-white text-sm">{val.Department}</p>
              </div>
  
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-meta-3 text-sm">{val.time}</p>
              </div>
  
            </div>
          ))}
        </div>
      </div>
    </div>
    

    <div className="second">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Employee Leave details
        </h4>
  
        <div className="flex flex-col">
          <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-3">
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase ">
              Employee Name
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase ">
              Department
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase ">
              Availed Date
              </h5>
            </div>
            
          </div>
  
          {data.map((val, key) => (
            <div
              className={`grid grid-cols-3 sm:grid-cols-3 ${
                key === data.length - 1
                  ? ''
                  : 'border-b border-stroke dark:border-strokedark'
              }`}
              key={key}
            >
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                <div className="flex-shrink-0">
                  {/* <img src={data.logo} alt="Brand" /> */}
                </div>
                <p className="hidden text-black dark:text-white sm:block text-sm">
                  {val.name}
                </p>
              </div>
  
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-black dark:text-white text-sm">{val.Department}</p>
              </div>
  
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-meta-3 text-sm">{val.Avail}</p>
              </div>
  
            </div>
          ))}
        </div>
      </div>
    
    </div>

 </div>

 <div className="third">
 <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Employee Leave Approval request
        </h4>
  
        <div className="flex flex-col">
          <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-4">
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase ">
              Requested Employee
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase ">
              Leave type
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase ">
              Date
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase ">
              Reporting Manager
              </h5>
            </div>
            
          </div>
  
          {data.map((val, key) => (
            <div
              className={`grid grid-cols-3 sm:grid-cols-4 ${
                key === data.length - 1
                  ? ''
                  : 'border-b border-stroke dark:border-strokedark'
              }`}
              key={key}
            >
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                <div className="flex-shrink-0">
                  {/* <img src={data.logo} alt="Brand" /> */}
                </div>
                <p className="hidden text-black dark:text-white sm:block text-sm">
                  {val.name}
                </p>
              </div>
  
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-black dark:text-white text-sm">{val.leave}</p>
              </div>
  
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-meta-3 text-sm">{val.date}</p>
              </div>

              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-black dark:text-white text-sm">{val.Manager}</p>
              </div>
  
            </div>
          ))}
        </div>
      </div>

 </div>
</div>
 
       

        
    );
  };
  

export default TableData