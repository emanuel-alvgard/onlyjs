import * as virtual from "./virtual.js"

// @
function _collect(view) {

    // AUTO WIDTH / HEIGHT
    view.bounds.width(document.documentElement.clientWidth)
    view.bounds.height(document.documentElement.clientHeight)

    for (const id in view._virtual) {
        if (id === "bounds") { continue }
        let virtual = view._virtual[id]
        let real = view._real[id]
        if (virtual._auto_width) {
            if (real.clientWidth !== virtual._width) { virtual._width = real.clientWidth; virtual.UPDATE = true } 
        }
        if (virtual._auto_height) { 
            if (real.clientHeight !== virtual._height) { virtual._height = real.clientHeight; virtual.UPDATE = true }
        }
    }
}



// @ EDIT rewrite whole function to create 1 string and set body.innerHTML?
// maybe solves the problem with rendering out of sync 

//let debounce = 3
//let count = 0

function _update(view) {



    for (const id in view._virtual) {

        let virtual = view._virtual[id]
        let real = view._real[id]

        for (const id in virtual._anims) {
            virtual._anims[id].update()
        }

        if (virtual.UPDATE) {

            /*
            if (virtual._bounds !== null) {
                //if (count === debounce) {
                    if ((virtual._l + virtual._w) < virtual._bounds._l) { continue } // @HERE this recks scrolling
                    if ((virtual._t + virtual._h) < virtual._bounds._t) { continue }
                    if (virtual._l > (virtual._bounds._l + virtual._bounds._w)) { continue }
                    if (virtual._t > (virtual._bounds._t + virtual._bounds._h)) { continue }
                    //count = 0
                //}
                //count ++
            }
            */
        
            if (virtual._auto_width) { real.style.width = "auto" }
            else { real.style.width = virtual._width + "px" }
            
            if (virtual._auto_height) { real.style.height = "auto" }
            else { real.style.height = virtual._height + "px" }

            let left = virtual._left
            let top = virtual._top

            if (virtual._bounds !== null) {
                left -= virtual._bounds._left
                top -= virtual._bounds._top
            }
            
            real.style.transform = "translate(" + left + "px," + top + "px)" // this gets affected by .view.port transform
            real.style.zIndex = virtual._z_index + ""

            // BACKGROUND
            if (virtual._image !== null) { 
                if (real.tagName === "IMG") { 
                    real.src = "data:image/jpg;base64," + virtual._image
                    real.style.objectPosition = virtual._image_position
                    real.style.objectFit = virtual._image_fit
                }
                else { 
                    real.style.backgroundImage = 'url("data:image/svg+xml;base64,' + virtual._image + '")' // @ADD image/svg+xml for svg files
                    real.style.backgroundPosition = virtual._image_position
                    real.style.backgroundSize = virtual._image_fit 
                } 
            }

            real.style.objectPosition = virtual._image_position
            real.style.objectFit = virtual._image_fit

            real.style.backgroundColor = "rgba(" + 
                virtual._color_r + "," +
                virtual._color_g + "," +
                virtual._color_b + "," +  
                virtual._color_a + ")" 
            
            // TEXT
            if (virtual._text !== null) { real.textContent = virtual._text }

            real.style.color = "rgba(" + 
                virtual._text_r + "," +
                virtual._text_g + "," +
                virtual._text_b + "," +  
                virtual._text_a + ")"

            real.style.paddingLeft = virtual._padding_left + "px "
            real.style.paddingTop = virtual._padding_top + "px "
            real.style.paddingRight = virtual._padding_right + "px "
            real.style.paddingBottom = virtual._padding_bottom + "px "

            // BORDER
            real.style.borderLeft = virtual._border_left
            real.style.borderTop = virtual._border_top
            real.style.borderRight = virtual._border_right
            real.style.borderBottom = virtual._border_bottom
            
            real.style.borderWidth = virtual._border_size + "px"
            real.style.borderColor = "rgba(" + 
                virtual._border_r + "," +
                virtual._border_g + "," +
                virtual._border_b + "," +  
                virtual._border_a + ")"

            real.style.borderRadius = 
                virtual._border_lt + "px " +
                virtual._border_rt + "px " +
                virtual._border_rb + "px " +
                virtual._border_lb + "px"

            // SHADOW
            real.style.boxShadow =
                virtual._shadow_x + "px " +
                virtual._shadow_y + "px " +
                virtual._shadow_blur + "px rgba(" +
                virtual._shadow_r + "," +
                virtual._shadow_g + "," +
                virtual._shadow_b + "," +  
                virtual._shadow_a + ")"


            if (virtual._text_size !== null) { real.style.fontSize = virtual._text_size + "px" }
            if (virtual._text_font !== null) { real.style.fontFamily = virtual._text_font }

            // VISIBILITY
            real.style.opacity = virtual._opacity + ""
            if (virtual._visible) { real.style.display = "block" }
            else { real.style.display = "none" }

            // OVERFLOW
            real.style.overflowX = virtual._overflow_x
            real.style.overflowY = virtual._overflow_y

            // FILTER
            real.style.filter = "brightness(" + virtual._brightness + ")"
        }

        // RESET EVENTS
        virtual.MOUSE_DOWN = false
        virtual.MOUSE_UP = false
        virtual.UPDATE = false
    }

    // RESET EVENTS
    view.SETUP = false
    view.FORMAT_SWITCH = false
    view.ORIENTATION_SWITCH = false
}



// @
export function setup(context) {

    const view = {

        SETUP: true,

        bounds: null,
        port: null,
        _virtual: {},
        _real: {},

        // @DONE
        virtual(id, bounds) {
            if (id in view._virtual) { return view._virtual[id] }
            view._virtual[id] = virtual.element(context, view, bounds, id)
            return view._virtual[id]
        },
        
        // @DONE
        real(id, type, bounds) {

            if (id in view._real) { return view._real[id] }

            let element
            let ssr = document.getElementById(id)
            if (ssr !== undefined && ssr !== null) { element = ssr }
            else { element = document.createElement(type) }
    
            element.id = id
            element.style.display = "block"
            element.style.position = "absolute"
            element.style.margin = "0px"
            element.style.padding = "0px"
            element.style.border = "none"
            element.style.backgroundRepeat = "no-repeat"
            element.style.boxSizing = "border-box"
            element.style.overflow = "hidden"
            element.style.outline = "rgba(0,0,0,0)"
    
            view._real[id] = element
            if (id !== "bounds") { bounds.real().append(element) }
        },

        // @DONE
        element(id, type="div", bounds=view.bounds) {
            view.real(id, type, bounds)
            return view.virtual(id, bounds)
        },

        // @DONE
        collect() { _collect(view) },

        // @DONE
        update() { _update(view) },

        show() {},
        hide() {}
    }

    view.bounds = view.element("bounds", "div", null)
    document.body.append(view.real("bounds"))

    return view
}

