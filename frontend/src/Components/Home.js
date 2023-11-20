import moment from "moment/moment";
import React, { useEffect } from "react";

export default function Home({user}) {

    //setting states for form to create new task
    const [addTaskForm,setAddTaskForm] = React.useState(false);
    const [taskDesc,setTaskDesc] = React.useState('');
    const [date,setDate] = React.useState(moment().format('yyyy-MM-DDTHH:mm').toString());

    //setting states for form to edit task
    const [editNumber,setEditNumber] = React.useState(0);
    const [editForm,setEditForm] = React.useState(false);

    //state for displaying tasks
    const [data,setData] = React.useState();

    //state for displaying completed tasks
    const [completedData,setCompletedData] = React.useState();
    const [showComplete,setShowComplete] = React.useState(false);

    //refresh when tasks change
    const [refresh, setRefresh] = React.useState(true);

    const showHideComplete = !showComplete ? 'Show Completed Tasks':'Hide Completed Tasks'

    //Task object
    const taskObj = {
        taskDesc: taskDesc,
        date: date,
        complete: false
    }

    //pass the new task to the server
    function handleSubmit(e) {
        e.preventDefault();

        fetch(`http://localhost:8080/user/${user.id}/addTask`, ({
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            },
            body: JSON.stringify(taskObj)
        }))
        .then(res => {
            if (res.status === 200) {
                alert('Task Created!');
                setTaskDesc('');
                setDate(moment().format('yyyy-MM-DDTHH:mm').toString());
                setAddTaskForm(false);
                setRefresh(true);
            } else {
                alert('Something went wrong :(');
            }
        })
        .catch(err => console.log(err));
    }

    //convert format of datetime for frontend
    function convertDate(d) {
        let dArr = d.split('');
        dArr.splice(10,1,' ')
        return dArr.join('');
    }
    const formatDate = fd => {
        return moment(convertDate(fd),'yyyy-MM-DD HH:mm').format('MM-DD-yyyy h:mm A').toString();
    }

    //Display tasks on page load
    useEffect(() => {
        //current tasks
        const dataFetch = async () => {
            const data = await (
                await fetch(`http://localhost:8080/user/${user.id}/getTasks`, ({
                    method: "GET",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${user.token}`
                    }
                }))
            ).json();
            setData(data);
        };

        //completed tasks
        const completeFetch = async () => {
            const completedData = await (
                await fetch(`http://localhost:8080/user/${user.id}/completedTasks`, ({
                    method: "GET",
                    mode: "cors",
                    headers: {
                        "Content_Type": "application/json",
                        "Authorization": `Bearer ${user.token}`
                    }
                }))
            ).json();
            setCompletedData(completedData);
        };

        setRefresh(false);
        completeFetch();
        dataFetch();
    }, [user.id, user.token,refresh]);
    

    //temporary functions to ensure I am always working with an array thats not null or undefined
    function taskArr() {
        const arr = [];
        if (data) {
            data.forEach(element => {
                arr.push(element);
            });
        }
        return arr;   
    }
    function completedTaskArr() {
        const arr = [];
        if (completedData) {
            completedData.forEach(element => {
                arr.push(element);
            })
        }
        return arr;
    }

    //edit a specfic task
    function editHandler(e) {
        e.preventDefault();

        fetch(`http://localhost:8080/user/${user.id}/${editNumber}/edit`, ({
            method: "PUT",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            },
            body: JSON.stringify(taskObj)
        }))
        .then(res => {
            if (res.status === 200) {
                alert('Task Edited');

                //set states back to default
                setTaskDesc('');
                setDate(moment().format('yyyy-MM-DDTHH:mm').toString());
                setEditForm(false);
                setEditNumber(0);

                //refresh page
                setRefresh(true);
            } else {
                alert('Ruh Roh');
            }
        })
        .catch(err => console.log(err));
    }

    //change states for when edit button is clicked
    function editClick(task) {

        //expands or collapse form based on state
        setEditForm(!editForm);

        //set the inputs of the form as the current task info
        setEditNumber(task.taskNumber);
        setTaskDesc(task.taskDesc);
        setDate(task.date);
    }
    //change state when add new task button is click
    function addClick() {
        setAddTaskForm(!addTaskForm);
    }
    //change state of show completed forms
    function completeClick() {
        setShowComplete(!showComplete);
    }


    //delete the task
    function deleteTask(taskNumber) {

        //confirm that user actually wants to delete task
        if (!window.confirm('This will permenantly delete the task!!')) {
            return ;
        }

        fetch(`http://localhost:8080/user/${user.id}/${taskNumber}/delete`, ({
            method: "DELETE",
            mode: "cors",
            headers: {
                "Authorization": `Bearer ${user.token}`
            }
        }))
        .then(res => {
            if (res.status === 200) {
                alert('Task Deleted');
                setRefresh(true);
            } else {
                alert('Something Went Wrong');
            }
        })
        .catch(err => console.log(err));
    }

    //coomplete the task
    function complete(taskNumber) {
        fetch(`http://localhost:8080/user/${user.id}/${taskNumber}/completed`, ({
            method: "PUT",
            mode: "cors",
            headers: {
                "Content-Type":  "application/json",
                "Authorization": `Bearer ${user.token}`
            }
        }))
        .then(res => {
            if (res.status === 200) {
                alert('Task Completed!');
                setRefresh(true);
                setShowComplete(false);
            } else {
                alert('Something Went Wrong :(');
            }
        })
        .catch(err => console.log(err));
    }

    //new task form
    function addTask() {
        return (
            <div className="w-full bg-gray-100 rounded-xl bg-opacity-40 border-2 border-gray-400 mt-2">
                <form id="AddForm"onSubmit={handleSubmit} className="flex flex-col mx-5 py-4">
                    <h1 className="font-bold">
                        Task Description
                    </h1>
                    <textarea
                        className="px-1 mb-2 border-2 border-gray-400"
                        value={taskDesc}
                        onChange={(e) => setTaskDesc(e.target.value)}
                    />
                    <h2 className="font-bold">
                        Date
                    </h2>
                    <input type="datetime-local"
                        className="px-1 font-semibold border-2 border-gray-400"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}/>

                    <div className="flex flex-col lg:justify-between lg:flex-row items-center w-full mt-1">
                        <button className="w-full lg:w-1/2 lg:mr-2 text-center text-blue-900 font-extrabold py-2 my-2 bg-pink-300 hover:bg-gradient-to-r from-pink-400 to-fuchsia-500 hover:text-white text-sm"
                            onClick={e=>setAddTaskForm(false)}>
                            Cancel
                        </button>
                        <button className="w-full lg:w-1/2 lg:ml-2 text-center text-blue-900 font-extrabold py-2 my-2 bg-pink-300 hover:bg-gradient-to-r from-pink-400 to-fuchsia-500 hover:text-white rounded text-sm"
                            type="submit" value="addTask">
                            Add New Task
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    //edit task form
    function edit()  {
        return (
            <div className="border-t-2 border-black py-2 mt-1">
                <form id="EditForm" className="" onSubmit={editHandler}>
                    <h1>
                        Task Description
                    </h1>
                    <textarea className="w-full"
                        value={taskDesc}
                        onChange={(e) => setTaskDesc(e.target.value)}
                    />
                    <h2>
                        Task Date
                    </h2>
                    <input type="datetime-local"
                        className="w-full"
                        value={date}
                        onChange={(e)=> setDate(e.target.value)}
                    />
                    <div className="flex flex-col lg:justify-between lg:flex-row items-center w-full mt-1">
                        <button className="py-2 px-1 my-2 w-full lg:w-1/2 lg:mr-2 text-center text-blue-900 font-extrabold bg-pink-300 hover:bg-gradient-to-r from-pink-400 to-fuchsia-500 hover:text-white rounded text-sm"
                            onClick={e=>setEditForm(false)}>
                            Cancel
                        </button>
                        <button className="py-2 px-1 my-2 w-full lg:w-1/2 lg:ml-2 text-center text-blue-900 font-extrabold bg-pink-300 hover:bg-gradient-to-r from-pink-400 to-fuchsia-500 hover:text-white rounded text-sm"
                            type="submit" value="editTask">
                            Finish Editing
                        </button>
                    </div>
                </form>
            </div>
        )
    }

    //display list of completed tasks
    function finishedTasks() {
        return (
            <div className="flex flex-col py-2 w-full px-10">
                {completedTaskArr().map((task) => {
                    return (
                        <div key={task.taskDesc} className="bg-fuchsia-100 bg-opacity-70 border-gray-700 border-2 rounded-xl my-2 py-2 px-3 w-full">
                            <p className="pb-1 font-semibold break-words">
                                {task.taskDesc}
                            </p>
                            <div className="font-semibold text-gray-500">
                                {convertDate(formatDate(task.date))} 
                            </div>
                        </div>
                    );
                })}
            </div>
        )
    }


    return (
        <section id="home" className="flex flex-col lg:flex-row-reverse h-[90vh] overflow-y-scroll scrollbar">
            <div className="container w-full md:w-4/5 lg:w-2/5 mx-auto flex py-5 px-10 flex-col items-center">
                <div className="bg-fuchsia-100 bg-opacity-70 border-gray-700 border-2 rounded-xl px-3 py-5 w-full lg:mx-5">
                    <div className="text-xl font-semibold flex flex-col">
                        <h1>
                            {taskArr().length} task(s) to do
                        </h1>
                        <h2>
                            {completedTaskArr().length} task(s) completed
                        </h2>
                    </div> 
                </div>
                <div className="bg-white bg-opacity-20 flex flex-col w-full items-center mt-5 lg:overflow-y-auto lg:scrollbar">
                    <button 
                    className="rounded-lg w-full text-center text-lg font-bold text-white py-2 bg-blue-500 hover:bg-gradient-to-tr hover:from-sky-500 hover:to-blue-500 border-2 border-gray-500"
                    onClick={e=>completeClick()}>
                        {showHideComplete}
                    </button>
                    {showComplete === true ? finishedTasks() : null}
                </div>
            </div>
            <div className="container w-full md:w-4/5 lg:w-3/5 mx-auto flex py-5 px-10 flex-col items-center">
                <div className="flex flex-col w-full lg:w-2/3  items-center justify-center">
                    {/*Popups the form to create new task when add task is clicked*/}
                    <button className="rounded-lg w-full text-center text-lg font-bold text-white py-2 bg-blue-500 hover:bg-gradient-to-tr hover:from-sky-500 hover:to-blue-500 border-2 border-gray-500"
                        onClick={e => addClick()}>
                            Add new task
                    </button>
                    {addTaskForm === true ? addTask() : null}
                </div>
                <div className="flex flex-col py-2 w-full overflow-auto scrollbar px-1 my-2">
                    {taskArr().map((task) => {
                        return (
                        <div key={task.taskNumber} className="bg-fuchsia-100 bg-opacity-70 border-gray-700 border-2 rounded-xl my-2 py-2 px-3 w-full">
                            <h1 className="pb-1 font-bold text-lg">
                                Task {task.taskNumber} 
                            </h1>
                            <div className="border-black border-b-2 -mx-3"/>

                            <p className="pb-1 pt-2 font-semibold break-words">
                                {task.taskDesc}
                            </p>
                            
                            <div className="pt-1 text-gray-500 font-semibold">
                                {convertDate(formatDate(task.date))}
                            </div>
                            <div className="flex flex-col lg:justify-between lg:flex-row items-center w-full mt-1">
                                <button className="w-full lg:w-1/3 text-center text-gray-50 font-extrabold py-2 my-2 bg-fuchsia-400 hover:bg-gradient-to-r from-pink-400 to-fuchsia-500 hover:text-white rounded text-sm" 
                                    onClick={e => deleteTask(task.taskNumber)}>
                                    Delete
                                </button>
                                {/*Expand edit task form when ediit button is clicked */}
                                <button className="w-full lg:w-1/3 text-center text-gray-50 font-extrabold py-2 mx-2 my-2 bg-fuchsia-400 hover:bg-gradient-to-r from-pink-400 to-fuchsia-500 hover:text-white rounded text-sm"
                                    onClick={e => editClick(task)}>
                                    Edit
                                </button>
                                <button className="w-full lg:w-1/3 text-center text-gray-50 font-extrabold py-2 my-2 bg-fuchsia-400 hover:bg-gradient-to-r from-pink-400 to-fuchsia-500 hover:text-white rounded text-sm"
                                    onClick={e => complete(task.taskNumber)}>
                                    Complete
                                </button>
                            </div>
                            {(editForm === true && editNumber === task.taskNumber) ? edit() : null}
                        </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}