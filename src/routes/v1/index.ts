import { Router } from "express";
import apiKey from "../../auth/apiKey";
import signup from "./access/signup";
import signin from "./access/login";
import logout from "./access/logout";
import token from "./access/token";
import admin from "./books/admin";
import booklist from "./books/booklist";

const router = Router();

/*--------------------------------------------------------*/
// Below all APIs are public APIs protected by api-key
router.use("/", apiKey);
/*--------------------------------------------------------*/

router.use("/signup", signup);
router.use("/signin", signin);
router.use("/logout", logout);
router.use("/token", token);
router.use("/books", booklist);
router.use("/admin/book", admin);

export default router;
