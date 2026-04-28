
//Improtiamo il modulo di express
const express = require('express')

//Inizializziamo l'app
const app = express()

//configuriamo l'indirizzo e la porta 
const PORT = 3000
const HOST = '0.0.0.0' //0.0.0.0 permette l'accesso da qualunque dispositivo nella 


//Navigazione


const path = require("path")



const ROOT = path.join(__dirname,'..','dist') 

app.use(express.static(ROOT)); 



const {createClient} = require("@supabase/supabase-js")

const supabaseApi = 'https://iblnubgcuixwisofranz.supabase.co' 
const supabaseApiKey = 'sb_publishable_KsiaMEm63i8xkGs-r829yA_YYII_mKb' 

const supabase = createClient(supabaseApi, supabaseApiKey)


