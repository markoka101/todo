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
            <div className="lg:w-full h-full md:w-full lg:h-4/5 flex flex-col md:mx-auto w-full md:py-4 text-lg font-bold">
                <form id="AddForm"onSubmit={handleSubmit} className="flex flex-col mx-10 md:py-4 text-lg">
                    <h1>
                        Task Description:
                    </h1>
                    <textarea
                        value={taskDesc}
                        onChange={(e) => setTaskDesc(e.target.value)}
                    />
                    <h2>
                        Date
                    </h2>
                    <input type="datetime-local"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}/>
                    <button type="submit" value="addTask">Add New Task</button>
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
                        Task Description:
                    </h1>
                    <textarea className="w-full"
                        value={taskDesc}
                        onChange={(e) => setTaskDesc(e.target.value)}
                    />
                    <h2>
                        Task Date:
                    </h2>
                    <input type="datetime-local"
                        value={date}
                        onChange={(e)=> setDate(e.target.value)}
                    />
                    <button type="submit" value="editTask">Finish Editing</button>
                </form>
            </div>
        )
    }

    //display list of completed tasks
    function finishedTasks() {
        return (
            <div className="bg-green-500">
                {completedTaskArr().map((task) => {
                    return (
                        <div key={task.taskDesc} className="border-black border-4">
                            <h1>
                                {task.taskDesc}
                            </h1>
                            {convertDate(formatDate(task.date))} <br></br>
                        </div>
                    );
                })}
            </div>
        )
    }

    /*
    Currently using different colors to help me visualize the different components 
    while implementing functionality
    Design will come after everything is fully functional
    */
    return (
        <section id="home" className="flex flex-col md:flex-row lg:flex-row h-[90vh] overflow-auto scrollbar">
            <div className="container w-3/5 mx-auto flex px-10-py-30 md:flex-col flex-col justify-center items-center">
                <div className="flex w-full md:mt-4 lg:mt-4 items-center justify-center">
                    {/*Popups the form to create new task when add task is clicked*/}
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold w-1/2 py-2 px-4 border border-blue-700 rounded"
                        onClick={e => addClick()}>
                            Add new task
                    </button>
                    {addTaskForm === true ? addTask() : null}
                </div>
                <div className=" py-2 w-full md:w-2/3 lg:w-1/2 overflow-auto scrollbar">
                    {taskArr().map((task) => {
                        return (
                        <div key={task.taskNumber} className="bg-gradient-to-tr from-orange-100 to-orange-200 opacity-70 border-black border-2 my-2 py-2 px-3">
                            <h1 className="pb-1">
                                Task {task.taskNumber} 
                            </h1>
                            <div className="border-black border-b-2 -mx-3"/>

                            <p className="pb-1 pt-2 rounded text break-words">
                                {task.taskDesc}
                            </p>

                            <div className="border-b-2 border-black border-dotted"/>
                            
                            <div className="rounded pt-1">
                                {convertDate(formatDate(task.date))}
                            </div>
                            <div className="flex flex-col lg:justify-between lg:flex-row items-center w-full mt-1">
                                <button className="w-full lg:w-1/3 text-center text-blue-900 font-extrabold py-2 my-2 bg-pink-300 hover:bg-gradient-to-r from-pink-400 to-fuchsia-500 hover:text-white rounded text-sm" 
                                    onClick={e => deleteTask(task.taskNumber)}>
                                    Delete
                                </button>
                                {/*Expand edit task form when ediit button is clicked */}
                                <button className="w-full lg:w-1/3 text-center text-blue-900 font-extrabold py-2 mx-2 my-2 bg-pink-300 hover:bg-gradient-to-r from-pink-400 to-fuchsia-500 hover:text-white rounded text-sm"
                                    onClick={e => editClick(task)}>
                                    Edit
                                </button>
                                <button className="w-full lg:w-1/3 text-center text-blue-900 font-extrabold py-2 my-2 bg-pink-300 hover:bg-gradient-to-r from-pink-400 to-fuchsia-500 hover:text-white rounded text-sm"
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
            <div className="container w-2/5 bg-orange-100 flex py-30 flex-col justify-center items-center">
                <div className="bg-rose-200">
                    <h1>{taskArr().length}</h1>
                    <h2>{completedTaskArr().length}</h2>
                    <button onClick={e=>completeClick()}>show completed tasks</button>
                    {showComplete === true ? finishedTasks() : null}
                </div>
            </div>
        </section>
    );
}