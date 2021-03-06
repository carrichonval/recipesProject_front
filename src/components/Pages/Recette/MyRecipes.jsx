import React,{useState,useEffect} from 'react';
import Select from 'react-select';
import lodash from "lodash"
import Pagination from '../../composants/Pagination';
import usePagination from '../../hooks/usePagination';
import ItemCard from './ItemCard'
import FetchDataLoader from '../../composants/FetchDataLoader'
import { getUserAuth } from '../../functions/auth';

export default function MyRecipes (props){

    const [recipes,setRecipes] = useState(null)
    const [searchName,setSearchName] = useState("")
    const [searchType,setSearchType] = useState("")
    const [searchNote,setSearchNote] = useState("")
    const options = [
        {
            value:null,
            label:"Pas noté"
        },
        {
            value:"0",
            label:"0"
        },
        {
            value:"1",
            label:"1"
        },
        {
            value:"2",
            label:"2"
        },
        {
            value:"3",
            label:"3"
        },
        {
            value:"4",
            label:"4"
        },
        {
            value:"5",
            label:"5"
        },
    ]

    const typeRecipes = [
        {
            value:"0",
            label:"Entrée"
        },
        {
            value:"1",
            label:"Plat"
        },
        {
            value:"2",
            label:"Dessert"
        }
        ,
        {
            value:"3",
            label:"Gateaux"
        }
    ]

    const optionsTrie = [
        {
            value:"0",
            label:"Ordre alphabétique"
        },
        {
            value:"1",
            label:"Les plus réalisés"
        },
        {
            value:"2",
            label:"Les mieux notés"
        },
    ]

    //Pagination que si l'on a + de 8 recettes
    const { next, prev, jump, currentPage, maxPage,startIndex, endIndex , paginate} = usePagination(recipes ? recipes : [],8)

    useEffect(() => {
        fetchRecettes()
    }, []);

    //trier
    const trierPar = (e) => {
        switch (e.value) {
            case "0":
                let test = lodash.orderBy(recipes,["name"],["asc"])
                setRecipes(test)
                break;
            case "1":
                let test2 = lodash.orderBy(recipes,["achieve"],["desc"])
                setRecipes(test2)
                break;
            case "2":
                let test3 = lodash.orderBy(recipes,["note"],["desc"])
                setRecipes(test3)
                break;
            default:
                break;
        }
    }

    //recuperer les recettes
    const fetchRecettes = async () => {
        fetch(process.env.REACT_APP_API_URL+'/recettes/user/'+getUserAuth().id, {
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
            lodash.forEach(json,(recipe)=>{
                let note = getNote(recipe.recette_notes)
                recipe.note = note
                recipe.value = recipe.id
                recipe.label = recipe.type
            })
            setRecipes(json)
        })
        .catch((error) => {
            console.log(error)
        });

    }

    //recupere la note
    const getNote = (notes) => {
        
        if(notes && notes.length > 0 ){
            let total = 0
            lodash.forEach(notes,(n)=>{
                total += n.note
            })
            return Math.round(total / notes.length)
        }else{
            return null
        }  
    }

    if(recipes == null){
        return  <FetchDataLoader text="Récupération des données" />
    }
    
    return (
        <>
        
            <div className={" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 flex flex-col"}>
                <div className="flex flex-col lg:flex-row w-full">
                    <div className="flex flex-row items-center justify-center mb-3 w-full lg:w-1/3">
                        <input onChange={(e)=>setSearchName(e.target.value)} className="w-full bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block appearance-none leading-normal" type="text" placeholder="Rechercher"/>
                    </div>
                    <div className="flex flex-row mb-3 w-full lg:w-1/5 lg:ml-2">
                        <Select
                            options={typeRecipes}
                            onChange = {(e)=>setSearchType(e)}
                            placeholder="Type de recette"
                            className="w-full"
                            isClearable
                            isSearchable
                        />
                    </div>
                    <div className="flex flex-row mb-3 w-full lg:w-1/5 lg:ml-2">
                        <Select
                            options={options}
                            onChange = {(e)=>setSearchNote(e)}
                            placeholder="Filtrer par note"
                            className="w-full"
                            isClearable
                            isSearchable
                        />
                    </div>
                    <div className="flex flex-row mb-3 w-full lg:w-1/5 lg:ml-2">
                        <Select
                            options={optionsTrie}
                            onChange = {(e)=>trierPar(e)}
                            placeholder="Trier par"
                            className="w-full"
                            isClearable
                            isSearchable
                        />
                    </div>
                </div>
                {recipes.length == 0 ? 
                        <div className="flex w-full">
                            <div className="rounded-md bg-blue-200 p-2 mt-2 mx-4 w-full">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-md leading-5 font-medium text-blue-800">
                                            Tu n'as publié aucune recettes
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    : null}

                <ul class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {recipes.slice(startIndex, endIndex).map((recipe)=>{
                        if(recipe.name.toLowerCase().search(searchName.toLowerCase()) === -1 ){
                            return null
                        }
                        if(searchType){
                            if(recipe.type.toLowerCase().search(searchType.label.toLowerCase()) === -1 ){
                                return null
                            }
                        }
                        if(searchNote){
                            if(recipe.note != searchNote.value){
                                return null
                            }
                        }

                        return(
                            <ItemCard recipe={recipe} deletable={true} fetchRecettes={fetchRecettes} />
                        )
                    })}

                </ul>

                <Pagination currentPage={currentPage} next={next} prev={prev} jump={jump} paginate={paginate} maxPage={maxPage} />

            </div>
        </>
    )
}



