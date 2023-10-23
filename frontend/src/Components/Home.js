import moment from "moment/moment";
import React, { useEffect } from "react";
import Popup from 'reactjs-popup';
import EditForm from "./EditForm";

export default function Home({user}) {

    //setting states for form to create new task
    const [taskDesc,setTaskDesc] = React.useState('');
    const [date,setDate] = React.useState(moment().format('yyyy-MM-DDTHH:mm').toString());

    //setting states for form to edit task
    const [editDesc,setEditDesc] = React.useState('');
    const [editDate,setEditDate] = React.useState('');
    const [editForm,setEditForm] = React.useState(false);

    //state for displaying tasks
    const [data,setData] = React.useState();
    //refresh when tasks change
    const [refresh, setRefresh] = React.useState(true);

    //states for popup
    const [open,setOpen] = React.useState(false);
    const close = () => setOpen(false);


    //New Task object
    const newTask = {
        taskDesc: taskDesc,
        date: date,
        complete: false
    }

    //edit task object
    const editTask = {
        editDesc: editDesc,
        editDate: editDate,
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
            body: JSON.stringify(newTask)
        }))
        .then(res => {
            if (res.status === 200) {
                alert('Task Created!');
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
            setRefresh(false);
        };
        dataFetch();
    }, [user.id, user.token,refresh]);
    

    //temporary function to ensure I am always working with an array thats not null or undefined
    function tf() {
        const arr = [];
        if (data) {
            data.forEach(element => {
                arr.push(element);
            });
        }
        return arr;   
    }

    //edit a specfic task
    function edit(taskNumber) {
        fetch(`http://localhost:8080/user/${user.id}/${taskNumber}/edit`, ({
            method: "PUT",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            },
            body: JSON.stringify(editTask)
        }))
        .then(res => {
            if (res.status === 200) {
                alert('Task Edited');
            } else {
                alert('Ruh Roh');
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
            } else {
                alert('Something Went Wrong :(');
            }
        })
        .catch(err => console.log(err));
    }

    return (
        <section id="home" className="flex flex-row w-75 h-75 overflow-clip">
            <div className="container w-1/2 bg-gray-100 mx-auto flex px-10-py-30 md:flex-col flex-col justify-center items-center overflow-auto">
                <div className="bg-blue-400 w-full items-center justify-center">
                    {/*Popups the form to create new task when add task is clicked*/}
                    <Popup position={"right top"}
                        trigger={<button className="button bg-pink-500">Add Task</button>}>
                        <div className="bg-gray-500 lg:w-full h-full md:w-full lg:h-4/5 flex flex-col md:mx-auto w-full md:py-4 text-lg font-bold place">
                            <form id="AddForm"onSubmit={handleSubmit} className="flex flex-col md:py-4 text-lg">
                                <label>
                                    Task Description
                                </label>
                                <textarea
                                    value={taskDesc}
                                    onChange={(e) => setTaskDesc(e.target.value)}
                                />
                                <label>
                                    Date
                                </label>
                                <input type="datetime-local"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}/>
                                <button type="submit" value="addTask">Add New Task</button>
                            </form>
                        </div>
                    </Popup>
                </div>
                <div className="bg-orange-300">
                    {tf().map((task) => {
                        return (
                        <div key={task.taskNumber} className="border-black border-4">
                            <h1>
                                {task.taskNumber} 
                            </h1>
                            <p>
                                {task.taskDesc}
                            </p>

                            {convertDate(formatDate(task.date))}<br></br>
                            {task.complete.toString()} <br></br>
                            {/*Popup edit task form when button is clicked */}
                            {editForm ? <EditForm editTask={task} /> : null}
                            <button onClick={() => <EditForm editTask={task} />}>Edit Task</button>
                            <button onClick={e => complete(task.taskNumber)}>Complete</button>

                        </div>
                        );
                    })}
                </div>
            </div>
            <div className="container w-1/2 bg-orange-100 mx-auto flex px-10-py-30 md:flex-row flex-col justify-center items-center"></div>
        </section>
    );
}