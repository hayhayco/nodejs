var express     = require("express"),
    bodyParser  = require("body-parser"),
    mongoose = require('mongoose'),
    method = require("method-override"),
    app         = express();


    //mongoose.connect('mongodb://localhost/world')
    mongoose.connect('mongodb://world:123456@ds157621.mlab.com:57621/node_exercise');

    //middleware
    app.use(method("_method"));// dipakai untuk di URL sebagai direksi edit delete
    app.use(bodyParser.urlencoded({extended:true})); //baca HTML POST GET
    app.use(express.static("public"));//untuk menambah direktori css img js
    app.set("view engine", "ejs");//untuk merender html folder views

    var worldSchema = new mongoose.Schema({ //
      title  : String,
      image  : String,
      des : String
    })

    var world = mongoose.model("world",worldSchema); // untuk CRUD "world"database, worldSchema (Bentuk collection)

    // world.create({
    //   title : "Halaman",
    //   image : "https://farm3.staticflickr.com/2840/9995249456_cf25b32772.jpg",
    //   des: "ruarbiasa"
    // }, function(err,cat){
    //   if(err){
    //     console.log("World error")
    //   }else {
    //     console.log(cat)
    //   }
    // });

    // var Cat = mongoose.model('kucing', { name: String, umur: String, warna : });
    //
    // var kitty = new Cat({ name: 'Zildjian' });
    // kitty.save(function (err) {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     console.log('meow');
    //   }
    // });

    app.get("/",function(req,res){//untuk redirect pada saat masukin localhost 3000 ke /world
      res.redirect("/world")
    });


    app.get("/world", function(req,res){ //untuk membaca /world sebagai index.ejs

      world.find({},function(err,allWorlds){ //dara yang dipanggil .find{} masuk ke allWorlds
        if (err){
          console.log(err);
        }else {
          res.render("index",{world: allWorlds}); // dari allWorlds dialiaskan ke world
        }
      })

    });

    app.get("/world/new", function(req,res){//untuk membaca /world/new di url
      res.render("new");
    });
    //create post

    app.post("/world", function(req,res){
      var title = req.body.title; //mengambil dari form body
      var image = req.body.image;
      var des = req.body.des;
      var newWorld = {title:title, image:image, des:des};

      world.create(newWorld, function(err) //.create newWorld adalah masukin data dari body
      {
        if (err)
        {
          console.log(err);
        }else
        {
          res.redirect("/", {newWorld:newWorld});
        }
      })

    });

    //show route
    app.get("/world/:id", function(req,res){
      world.findById(req.params.id, function(err, foundWorld)
    {
      if (err)
      {
          console.log(err);
      }else {
        res.render("show",{world:foundWorld});//memasukan foundWorld kedalam world untuk dipakai di html
      }
    })
  });

  //edit route
app.get("/world/:id/edit",function(req,res){
  world.findById(req.params.id, function(err, foundWorld){
    if(err){
      console.log(err);

    }else {
      res.render("edit",{world:foundWorld});
    }
  })
})

//update route
app.put("/world/:id",function(req,res)
{
  
  world.findByIdAndUpdate(req.params.id, req.body.world, function(err,updateWorld) //
  {
    if (err){
      console.log(err);
    }
    else
      {
        res.redirect(req.params.id);
      }
    })
  });

//delete route
app.delete("/world/:id", function(req,res)
{
  world.findByIdAndRemove(req.params.id, function(err){
    if (err){
      console.log(err);
    }
    else {
      res.redirect("/");
    }
  })

})

    app.listen(process.env.PORT||3000, function(){ //process.env.PORT digunakan untuk diserver dan 3000 untuk di local
      console.log("Server Starting");
    });
