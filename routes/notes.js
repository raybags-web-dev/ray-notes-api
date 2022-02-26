const express = require("express");
const NoteModel = require("../models/noteModel");
const router = express.Router();
const handleErrors = require("../middleware/async");

// get new note
router.get("/new", handleErrors(async(req, res) => {
    res.render("notes/new", { note: new NoteModel })
}));

// edit note
router.get("/edit/:id", handleErrors(async(req, res) => {
    let note = await NoteModel.findById(req.params.id);
    res.render("notes/edit", { note });

}));

router.get("/:slug", handleErrors(async(req, res) => {
    const note = await NoteModel.findOne({ slug: req.params.slug });
    if (note == null) res.redirect("/")
    res.render("notes/show", { note: note })
}))

// create note
router.post("/", async(req, res, next) => {
    req.note = new NoteModel();
    next();
}, saveNoteAndRedirect('new'));

// edit note
router.put("/:id", async(req, res, next) => {
    req.note = await NoteModel.findById(req.params.id);
    next();
}, saveNoteAndRedirect('edit'));

function saveNoteAndRedirect(path) {
    return async(req, res) => {
        let note = req.note;
        let reqBody = req.body;

        note.title = reqBody.title;
        note.description = reqBody.description;
        note.markdown = reqBody.markdown;

        try {
            note = await note.save();
            res.redirect(`/notes/${note.slug}`)

        } catch (e) {
            console.log("\n\v SOMETHING WENT WRONG!! \n\v")
            console.log(e.message);
            res.render(`notes/${path}`, { note: note });
            res.redirect("/")

        }
    }
}

router.delete("/:id", handleErrors(async(req, res) => {
    await NoteModel.findByIdAndDelete(req.params.id);
    res.redirect("/")
}));

module.exports = router;