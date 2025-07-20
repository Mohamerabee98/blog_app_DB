import authRouter from "./modules/auth/auth.controller.js"
import userRouter from "./modules/user/user.controller.js"
import blogRouter from "./modules/blog/blog.controller.js"
const bootstrap = (app ,express)=>{
app.use(express.json());

  //========== routers

  //============ auth

  app.use("/auth" , authRouter)

  //============ user
  app.use("/user" , userRouter)
  //============ blog
  app.use("/blog" , blogRouter)



}
export default bootstrap