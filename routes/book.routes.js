const express = require("express")
const router = express.Router();
const bookData = require("../data/books.json")
const { check, validationResult } = require("express-validator")
const { save } = require("../services/save.services")


router.get("/", (req, res) => {
    res.json(bookData)
})

router.post("/", [
    check("name", "Book name is required").not().isEmpty(),
    check("author", "Author name is required").not().isEmpty()
],  (req, res) => {
    const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array()
			});
		}
    const { name, author } = req.body;

    bookData.push({
        name,
        author,
        id: Math.random()
    })

    const isSaved = save(bookData);
    if (!isSaved) {
        return res.status(500).json({
            error: true,
            message: "could not save book"
        })
    }

   return res.send({
        message: "Success"
    })
})


router.put("/:bookid",async (req,res)=>{

    const {bookid} = req.params
    const {name,author} = req.body

    console.log(bookid)

    const foundBook = bookData.find((book)=>book.id==bookid);
    if(!foundBook){
        return res.status(404).send({
            error:true,
            message:"Book not found"
        })
    }

    let updatedBook = null;
    const updatedBooks= bookData.map((book)=>{
        if(book.id == bookid){
            updatedBook={
                ...book,
                name,
                author
            }
            return updatedBook
        }
        return book;
    })

    const isSaved = save(updatedBooks)
    if(!isSaved){
        return res.status(500).json({
            error:true,
            message:'could not save book'
        })
    }

     res.status(201).json(updatedBook)

});

router.delete("/:bookid",async (req,res)=>{
    const {bookid} = req.params

    const foundBook =  bookData.find((book)=>book.id == bookid);

    if(!foundBook){
       return res.status(404).json({
            errors:true,
            message:"Book not found"
        })
    }

    const updatedBook = bookData.filter((book)=>book.id != bookid);
    if(!updatedBook){
        return res.status(404).send({
            errors:true,
            message:"could not save book"
        })
    }

    res.status(201).json({
        message:"Success"
    })

})

module.exports = router