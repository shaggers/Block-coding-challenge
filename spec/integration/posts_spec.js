const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/posts/";
const sequelize = require("../../src/db/models/index").sequelize;
const Post = require("../../src/db/models").Posts;


describe("routes : posts", () => {

    beforeEach((done) => {
        this.post;
        sequelize.sync({force: true}).then((res) => {
  
         Post.create({
           title: "Post 1",
           description: "I am a post"
         })
          .then((post) => {
            this.post = post;
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
  
        });
  
    });

  describe("GET posts", () => {

    it("should return a status code 200 and all posts", (done) => {
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(body).toContain("Post 1");
        expect(body).toContain("I am a post");
        done();
      });
    });

  });

  describe("GET /posts/new", () => {

    it("should render a new post form", (done) => {
      request.get(`${base}new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Post");
        done();
      });
    });

  });

  describe("GET /posts/:id", () => {

    it("should render a view with the selected post", (done) => {
      request.get(`${base}${this.post.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Post 1");
        done();
      });
    });

  });

  describe("POST /posts/:id/destroy", () => {

    it("should delete the post with the associated ID", (done) => {

      Post.findAll()
      .then((posts) => {
        const postCountBeforeDelete = posts.length;

        expect(postCountBeforeDelete).toBe(1);
        request.post(`${base}${this.post.id}/destroy`, (err, res, body) => {
          Post.findAll()
          .then((posts) => {
            expect(err).toBeNull();
            expect(posts.length).toBe(postCountBeforeDelete - 1);
            done();
          })

        });
      });

    });

    describe("GET /posts/:id/edit", () => {

        it("should render a view with an edit post form", (done) => {
          request.get(`${base}${this.post.id}/edit`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("Edit Post");
            expect(body).toContain("Post 1");
            done();
          });
        });
   
      });

  });
});