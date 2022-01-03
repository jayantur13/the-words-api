const express = require('express')
const app = express()
const cheerio = require('cheerio')
const axios = require('axios')
const PORT  = process.env.PORT || 4000

//Some host/os needs these 2 lines to work
app.set('port', PORT);
app.use(express.static(__dirname + '/public'));

app.get('/', (req,res) => {
   res.status(200).send('Welcome,use the guide/readme to start using the API')
})


//GET a word for a your query
app.get('/post/:word',(req,res) => {
    const word = req.params.word;
    axios.get(`https://www.dictionary.com/browse/${word}`)
         .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const finalres = []
         
            const info = '--> This api is experimental  <--'
   
            const word = $('.css-jv03sw h1').text().replace(/(\r\n|\n|\r)/gm, "").trim()
            const pronounciation = $('.pron-spell-container span.pron-spell-content.css-7iphl0.evh0tcl1').first().text()
            
          
            $('div.audio-wrapper audio source',html).each(function () {
               const proaudio = $(this).attr('src') 
               audio = proaudio
            })

            const type = $('section.css-109x55k.e1hk9ate4 span.luna-pos').first().text()
            const meansentence = $('.default-content div.css-10ul8x.e1q3nk1v2').first().text()
           
            finalres.push({
               info,
               word,
               pronounciation,
               audio,
               type,
               meansentence
            })
            res.status(200).send(finalres)
         }).catch(err => res.status(404).json(err.message))
})

//Get Trending words
app.get('/trending',(req,res) => {
   axios.get('https://dictionary.com/')
        .then(response => {
           const html = response.data
           const $ = cheerio.load(html)
           const allwords = []
           const intrend = []
         
            $('div.css-69ktzx.e1ydg8n01 span.trending-words.trending-words-word.css-hhvldk.ewx439u1').each(function (i,elem) {
              allwords[i] = $(this).text()
           })
           for(let i=0;i< 10;i++){
              intrend.push(allwords[i])
           }
           res.status(200).send(intrend)//Get 1st 10 only;avoid duplicating
           
        }).catch(err => res.json(err.message))
})

app.listen(PORT,() => console.log(`Server running on port ${PORT}`))