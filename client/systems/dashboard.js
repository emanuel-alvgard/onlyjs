import table from "../components/table.js"
import toggle from "../components/toggle.js"

let CONTEXT
let DASHBOARD

let mode = "light"
let background = [220,220,220,1]
let main = [255,255,255,1]
let second = [250, 250, 250, 1]
let shadow = [220,220,220,1]
let transparent = [255,255,255,0]

// @TEST
let mock_data = {
    customers: []
}

for (let i=0; i < 100; i++) {
    mock_data.customers.push({
        name: "CUSTOMER " + (i + 1),
        number: "000"+ (i + 1),
        test: "test " + (i + 1)
    })
}




// @DONE
function color_mode() {
    if (mode === "light") {
        background = [120,120,120,1]
        main = [50,50,50,1]
        second = [150, 150, 150, 1]
        shadow = [120,120,120,1]
        mode = "dark"
    }
    else if (mode === "dark") {
        background = [220,220,220,1]
        main = [255,255,255,1]
        second = [245, 245, 245, 1]
        shadow = [100,100,100,1]
        mode = "light"
    }
}

// @DONE
function hover(element) {
    
    if (DASHBOARD.SETUP) {

        let hover = element.anim(
            "hover", 
            element.opacity,
            1.0,
            0.5,
            100
        )
    
        let leave = element.anim(
            "leave", 
            element.opacity,
            0.5,
            1.0,
            100
        )

        element.real().onmouseover = () => { hover.run() }
        element.real().onmouseleave = () => { leave.run() }
    }
}


export default (context) => {

    let alexandria_400 = context.font("alexandria_400", "alexandria_400.woff2")
    let _img_logo = context.image("img_logo", "logo_white.svg")
    let _img_logout = context.image("img_logout", "logout_white.svg")
    let _img_search = context.image("img_search", "search_black.svg")

    const dashboard = context.view("dashboard")
    dashboard.bounds.color(second)
    const e = dashboard.element

    const side_nav = e("side_nav")
    const img_logo = e("img_logo")
    const img_logout = e("img_logout")
    const version = e("version")

    const main_card = e("main_card")
    const img_search = e("img_search")
    const mode_toggle = e("mode_toggle")
    const search = e("search", "input")
    const customer_filter = e("customer_filter")
    const customer_table = e("customer_table")

    const customer_card = e("customer_card")

    const all = [side_nav, main_card, search]

    const cards = [main_card, customer_card]


    if (context.SETUP) { 
        CONTEXT = context 
        DASHBOARD = dashboard
        context.location.path = "main"
    }


    side_nav
        .top(dashboard.bounds.top())
        .left(dashboard.bounds.left())
        .extend_bottom(dashboard.bounds.bottom())
        .width(75)
        .z(10)
        .color([55,60,65,1])
        .shadow([0,3,7]) 
        .shadow_color([50,50,50,1])

    img_logo
        .top(25)
        .height(25)
        .width(img_logo.height() * 0.708)
        .x(side_nav.x())
        .image(_img_logo)
        .z(side_nav.z() + 1)
        .color(transparent)

    version
        .x(side_nav.x())
        .bottom(side_nav.bottom() - 10)
        .text("V.0.1")
        .text_color([240,240,240,1])
        .z(side_nav.z() + 1)
        .text_font(alexandria_400)


    img_logout
        .width(25)
        .height(25)
        .bottom(version.top() - 15)
        .x(side_nav.x())
        .z(side_nav.z() + 1)
        .image(_img_logout)
        .color(transparent)

    hover(img_logout)
    



    cards.forEach(card => {
        card
            .top(dashboard.bounds.top() + 10)
            .extend_bottom(dashboard.bounds.bottom() - 10)
            .color(main)
            .border_size(1) //
            .border_color(background)
            .border_radius([3,3,3,3])
            .shadow([0,3,7])
            .shadow_color(shadow)
            .z(1)
    })

    if (context.location.path === "main") {
        main_card
            .left(side_nav.right() + 10)
            .extend_right(dashboard.bounds.right() - 10)
    }
    if (context.location.path === "customer" && context.location.SWITCH) {

        let slide = main_card.anim(
            "slide", 
            main_card.right, 
            main_card.right(), 
            dashboard.bounds.left() - 100, 
            500, 
            [0,0,0,4]
        )

        let fade = main_card.anim(
            "fade", 
            main_card.opacity, 
            1.0, 
            0.0, 
            300, 
            [0,0,3]
        )

        slide.run()
        fade.run() 

    }

    //console.log(context.location.path);

    

    /*mode_toggle
        .left(main_card.left() + 10)
        .top(main_card.top() + 10)
        .width(50)
        .height(25)
        .z(2)

        toggle(mode_toggle, color_mode)*/
    
    search
        .x(main_card.x())
        .top(main_card.top() + 50)
        .width(main_card.width() / 3, 300, 1000)
        .height(50)
        .color(second)
        .border("solid")
        .border_size(1)
        .border_color(background)
        .border_radius([3,3,3,3])
        .z(2)
        .padding([10,0,45,0])
        .text_font(alexandria_400)
        .opacity(main_card.opacity())
    

    if (dashboard.SETUP) {
        search.real().placeholder = "Sök kund"
        // @TEST search.real().onclick = () => { context.image("img_logo").reload("search_black.svg") }
    }

    img_search
        .width(25)
        .height(25)
        .z(search.z() + 1)
        .image(_img_search)
        .color(transparent)
        .right(search.right() - 10)
        .y(search.y())
        .opacity(main_card.opacity())



    customer_filter
        .left(main_card.left() + 50)
        .width(300)
        .top(search.bottom() + 25)
        .extend_bottom(main_card.bottom() - 50)
        .color(second)
        .color(second)
        .border("solid") //
        .border_size(1)
        .border_color(background)
        .border_radius([3,3,3,3])
        .z(main_card.z() + 1)
        .opacity(main_card.opacity())


    customer_table
        .extend_right(main_card.right() - 50)
        .top(search.bottom() + 25)
        .left(customer_filter.right() + 10)
        .extend_bottom(main_card.bottom() - 50)
        .z(main_card.z() + 1)
        .color(second)
        .border("solid") //
        .border_size(1)
        .border_color(background)
        .border_radius([3,3,3,3])
        .opacity(main_card.opacity())
    
      
    table(customer_table, mock_data.customers, search)



    



}