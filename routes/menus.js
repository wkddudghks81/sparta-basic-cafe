import express from 'express';
import Joi from 'joi';
//prisma 할당
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
    log: ["query", "info", "warn","error"],
    errorFormat: "pretty",
})

const numberschema = Joi.object({
    //이메일 형식이고 필수로 존재
    menu_id: Joi.number().required()
  });

const router = express.Router();

//메뉴 갯수, 주문갯수, 총 주문 가격
router.get('/stats',async (req, res, next) => {
    try{
    //메뉴 갯수
    const menucount = await prisma.Menu.findMany({
        select:{
            id:true
        }
    })
    //주문 갯수
    const ordercount = await prisma.OrderHistory.findMany({
        select:{
            id:true,
            menu:true,
            price:true
        }
    })
    //총 주문 가격
    const totalprice = ordercount.reduce((sum, a) => sum + a.price, 0)

    res.status(200).json({
        stats: {
            totalMenus: menucount.length,
            totalOrders: ordercount.length,
            totalSales: totalprice
        }
    });
    }catch(error){
        res.status(500).json("서버에서 문제가 발생하였습니다")
        console.log(error)
    }
});

//홈페이지 주문 내역
router.get('/', async (req, res, next) => {
    try{
    const menus = await prisma.OrderHistory.findMany({
        select:{
            id:true,
            menu_id:true,
            name:true,
            type:true,
            temperature:true,
            price:true,
            totalOrders:true
        }
    })
    res.status(200).json({menus})
    }catch(error){
        res.status(500).json("서버에서 문제가 발생하였습니다")
        console.log(error)
    }
});

//메뉴
router.get('/menus', async (req, res, next) => {
    try{
    const menu = await prisma.Menu.findMany({
        select:{
            id:true,
            name:true,
            type:true,
            temperature:true,
            price:true,
            totalOrders:true
        }
    })
    res.status(200).json({menu})
    }catch(error){
        res.status(500).json("서버에서 문제가 발생하였습니다")
        console.log(error)
    }
});

//주문 내역
router.post('/order',async (req,res,next)=>{
    try{
    const {menu_id} = req.body
    await numberschema.validateAsync(req.body);
    //주문하고자 하는 메뉴 찾기
    const menu = await prisma.Menu.findFirst({
        where:{
            id:+menu_id
        }
    })
    if(!menu){
        return res.send(`
            <script>
                alert("메뉴 없음");
                window.location.href = '/'; // 원래 페이지 경로로 리다이렉트
            </script>
        `);
     }

    //메뉴의 이름, 온도등등 가져와서 기록. totalorder+1은 기본이 0이라서 적어야함
    const post = await prisma.OrderHistory.create({
        data:{
            menu_id:+menu_id,
            name:menu.name,
            temperature:menu.temperature,
            type:menu.type,
            price:menu.price,
            totalOrders:menu.totalOrders+1
        }
    })

    //주문 갯수 업데이트하기 위해서 주문내역에 있는 메뉴 id 찾기
    const count = await prisma.OrderHistory.findMany({
        where:{
            menu_id:+menu_id
        }
    })

    //찾은 내역 갯수를 주문 갯수에 업데이트하기
    const update = await prisma.Menu.update({
        where:{
            id:+menu_id
        },
        data:{
            totalOrders:count.length
        }
    })
    return res.status(200)
    // .json({post})
    }catch (error) {
        if (error.name === "ValidationError") {
          return res.status(409).json(error.message), console.log(error);
        }
        res.status(500).json("서버 내부 오류가 발생했습니다.");
        console.log(error);
    }
})

//주문 내역
router.get('/order',async (req,res,next)=>{
    try{
    const  menus = await prisma.OrderHistory.findMany({
        select:{
            id:true,
            menu_id:true,
            menu:true
        }
    })
    if(!menus){
        return res.status(404).json("주문내역이 없습니다")
    }
    return res.status(200).json({ menus})
    }catch(error){
        res.status(500).json("서버에서 문제가 발생하였습니다")
        console.log(error)
    }
})

export default router;
