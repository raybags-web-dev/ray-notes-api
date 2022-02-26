const mongoose = require("mongoose");
const { marked } = require("marked");

const slugify = require("slugify");
const createDomPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const dompurify = createDomPurify(new JSDOM().window);

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    markdown: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitizedHtml: {
        type: String,
    }

});

noteSchema.pre("validate", async function(next) {
    try {
        if (this.title) {
            this.slug = slugify(this.title, { lower: true, strict: true });
        }

        if (this.markdown) {
            this.sanitizedHtml = dompurify.sanitize(marked(this.markdown));
        }
        next();

    } catch (e) {
        // const error = new Error(e.message)
        console.log(`${e.message}`)
    }
})

const NoteModel = mongoose.model("Note", noteSchema);

module.exports = NoteModel;