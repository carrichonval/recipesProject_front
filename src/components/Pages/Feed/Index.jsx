import React, { useState,useEffect} from 'react';
import Publication from './Publication'
import lodash from 'lodash'

export default function Home (props){

    const [feed,setFeed] = useState([])
    const [users,setUsers] = useState([])

    useEffect(() => {
        fetchFeed()
        fetchUsers()
    }, []);

    const fetchFeed = () =>{
        fetch(process.env.REACT_APP_API_URL+'/results', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then((json) => {
            //Oragnise les commentaires par user_id
            lodash.forEach(json,(feed)=>{
                let orderResult = lodash.orderBy(feed.result_comments,['user_id'],['asc'])
                feed.result_comments = orderResult
            })
            setFeed(json)
        })
        .catch((error) => {
            console.log(error)
        });
    }

    const fetchUsers = () =>{
        fetch(process.env.REACT_APP_API_URL+'/users', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then((json) => {
          setUsers(json)
        })
        .catch((error) => {
            
        });
    }
    
    return (
        <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 flex flex-col">
                <ul class="grid grid-cols-1 gap-6  lg:grid-cols-3 xl:grid-cols-3">
                    {feed.map((f)=>{
                        return(
                            <Publication feed={f} users={users} fetchFeed={fetchFeed}/>
                        )
                    })}
                </ul>
            </div>
        </>
    )
}


