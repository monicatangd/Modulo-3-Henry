// const bodyParser = require("body-parser");
const express = require("express");


const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
const posts = [];
funtion idGenerator(){
    let id=1;
    return function(){
        id++;
        return id;
    };
}
const generateID=idGenerator();

const server = express();
// to enable parsing of json bodies for post requests
// server.use(express.json());
server.use(express.json());
// TODO: your code to handle requests
server.post("/posts", (req, res)=>{
    const {author, title, contents } =req.body;
    if(!author || !title || !contents)
        res.status(STATUS_USER_ERROR).json({
            error: "No se recibieron los parametros necesarios para crear el post"
        });
        const newPost= {...req.body, id: generateID()};
        posts.push(newPost);
        res.json(newPost);
});

server.post("/posts/author/:author", (req, res)=>{
    const {title, contents}= req.body;

    if (!title || !contents || !req.params.author)
        res.status(STATUS_USER_ERROR).json({
            error: "No se recibieron los parametros necesarios para crear el post"
        });

    const newPost={...req.body, ...req.params, id: generateID()};
    posts.push(newPost);
    res.json(newPost);
});
server.get("/posts", (req, res)=>{
    if(req.query.term){
        const postsWithTerm=posts.filter(
            post=>
                post.title.includes(req.query.term)||
                post.contents.includes(req.query.term)
        );
        res.json(postsWithTerm);
    }
    res.json(posts);
});

server.get("/posts/:author", (req, res)=>{
    const postsByAuthor=posts.filter(post=> post.author === req.params.author);

    if(postsByAuthor.length) res.send(postsByAuthor);
    else
        res
            .status(STATUS_USER_ERROR)
            .send({error:"No existe ningun post del autor indicado"});
});

server.get("/posts/:author/:title", (req, res)=>{
    const {author, title}= req.params;
    const postsByAuthorAndTitle=posts.filter(
        post=> post.author === author && post.title ===title
    );

    if(postsByAuthorAndTitle.length) res.send(postsByAuthorAndTitle);
    else
        res.status(STATUS_USER_ERROR).send({
                error:"No existe ningun post con dicho titulo y autor indicado"
            });
});

server.put("/posts", (req,res)=>{
    const {id, title, contents}=req.body;
    if(!id|| !title || !contents)
        res.status(STATUS_USER_ERROR).send({
            error:
            "No se recibieron los parametros necesarios para modificar el post"
        });

    const post=post.find(post=>post.id===id);
    if(!post)
        res.status(STATUS_USER_ERROR).send({
         error: "No existe un post con ese ID",
        });

    post.title=title;
    post.contents=contents;
    res.json(post);
});

server.delete("/posts", (req, res)=>{
    const {id}= req.body;

    if(!id)
        res.status(STATUS_USER_ERROR).send({
            error:
                "No se recibieron los parametros necesarios para modificar el post"
        });
    const post =posts.find(post =>post.id === id);

    if(!post)
        res.status(STATUS_USER_ERROR).send({
            error: "No existe un post con ese ID",
        });


    posts.splice(post.indexOf(post), 1);
  
   
    res.json({succes:true});
});

server.delete("/author", (req, res)=>{
    const {author}= req.body;

    if(!author)
        res.status(STATUS_USER_ERROR).send({
            error:
                "No se recibieron los parametros necesarios para modificar el post"
        });
    const postsToDelete =posts.filter(post =>post.author === author);

    if(!postsToDelete.length)
        res
        .status(STATUS_USER_ERROR)
        .send({ error: "No existe el autor indicado"});

    postsToDelete.forEach(post=>{
        posts.splice(posts.indexOf(post), 1);
    });
   
    res.json(postsToDelete);
});
module.exports = { posts, server };
