const filename = "index.json"
const user = 'cmySuhao'
const date = new Date();
const formatter = new Intl.DateTimeFormat('vi', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
})
const [tday, tmonth, tyear] = formatter.format(date).split('/')

fetch (filename)
    .then( f => f.text() )
    .then( t => main(t) )

var editBoxShow = ""
var newShirt = ""

const [PrintBoat] = document.getElementsByClassName("mylist")

/**
 * @param {string} tagname
 * @param {object} mytag
 * @param {Array} list
 */

function addOption(tagname, mytag, list) {
    for (var index = 0; index < list.length; index++) {
        const element = document.createElement(tagname)
        element.text = list[index]
        mytag.add(element)
    }
}

function main(jstext) {
    var rmb
    const uservalue = String(localStorage.getItem(user))
    //const uservalue = 'null'
    if (uservalue !== 'null') {
        rmb = JSON.parse(uservalue)
    } else {
        rmb = JSON.parse(jstext)
    }

    const [monthBox] = document.getElementsByClassName("dog-month")
    const [yearBox] = document.getElementsByClassName("dog-year")
    addOption("option", yearBox, rmb.year)
    const [shirtsBox] = document.getElementsByClassName("shirts")
    const [actorBox] = document.getElementsByClassName("actor")
    const [sideBtn] = document.getElementsByClassName("sideBtn")
    const [sideBar] = document.getElementsByClassName("sidebar")
    const [boLoc] = document.getElementsByClassName("boLoc")
    const [boLocCheck] = document.getElementsByClassName("boLocCheck")
    const [buttonBox] = document.getElementsByClassName("buttonBox")
    const [editYear, editShirts, editActor] = document.getElementsByClassName("edit")
    const [editBox] = document.getElementsByClassName("editBox")
    const [editList] = document.getElementsByClassName("editlist")
    const [addBtn, applyBtn, cancelBtn] = document.getElementsByClassName("editBoxBtn")
    const [addSBtn, applySBtn, cancelSBtn] = document.getElementsByClassName("addShirtBtn")
    const [addShirtBtn] = document.getElementsByClassName("addBtn")
    const [addShirtBox] = document.getElementsByClassName('addShirtBox')
    const [addColorsList] = document.getElementsByClassName('addColors')
    const [shirtName, shirtSize, shirtCode] = document.getElementsByClassName('addBoxType')
    const [rday, rmonth, ryear, ractor, rshirt] = document.getElementsByClassName('addShirtSelect')
    const addImageBtn = document.getElementById('image-input')
    const [addImage] = document.getElementsByClassName('addImage')
    const [reloadBtn] = document.getElementsByClassName('reloadBtn')
    const [searchBox] = document.getElementsByClassName('searchBox')

    function rmbSort() {
        const rsort = Object.keys(rmb.shirtList)
        rsort.sort()
        const newOj = {}
        for (let i = 1; i <= rsort.length; i++) {
            newOj[rsort[rsort.length - i]] = rmb.shirtList[rsort[rsort.length - i]]
        }
        return newOj
    }

    function loadSearch(r) {
        if (searchBox.value.trim() === '') {
            return true
        } else if (searchBox.value.trim().substring(0, 1) === '#') {
            if (searchBox.value.trim().substring(1).trim() === String(r.code)) {
                return true
            }
        } else if (r.name.toUpperCase().match(searchBox.value.toUpperCase())) {
            return true
        }
    }

    function readActorShirts() {
        const actorCheck = document.getElementsByName('actor-radio')
        const shirtCheck = document.getElementsByName('shirts-radio')
        let ractor, rshirt

        for (let i = 0; i < actorCheck.length; i++) {
            if (actorCheck[i].checked) {
                ractor = rmb.actor[i]
                break
            }
        }

        for (let i = 0; i < shirtCheck.length; i++) {
            if (shirtCheck[i].checked) {
                rshirt = rmb.shirts[i]
                break
            }
        }

        return [ractor, rshirt]
    }

    function resetView() {
        const items = document.getElementsByClassName('items')
        for (let index = 0; index < items.length; index++) {
            const element = items[index]
            const [month, ind] = element.id.split(",")
            const readrmb = rmb.shirtList[month][Number(ind)]
            const [ractor, rshirt] = readActorShirts()
            if ((boLocCheck.checked === true) &&
                ((readrmb.month + '/' + readrmb.year) !== (monthBox.value + '/' + yearBox.value) ||
                ((ractor !== 'Tất cả') && (readrmb.actor !== ractor)) ||
                ((rshirt !== 'Tất cả') && (readrmb.shirt !== rshirt)))) 
            {
                element.style.display = 'none'
                
            } else {
                element.style.display = 'flex'
                if (loadSearch(readrmb)) {
                    element.style.display = 'flex'
                } else {
                    element.style.display = 'none'
                }
            }
        }
    }

    function reDrawShirtList() {
        PrintBoat.innerHTML = ""
        rmb.shirtList = rmbSort()
        for (let month in rmb.shirtList) {
            const monthList = rmb.shirtList[month];
            if (monthList.length > 0) {
                const newLine = document.createElement('div')
                newLine.style.display = 'flex'
                newLine.innerHTML = `
                    <div class="viewDate">T${month}</div>
                    <div class="viewDateLine"></div>
                `
                PrintBoat.appendChild(newLine)
            }

            for (let index = 0; index < monthList.length; index++) {
                const element = monthList[monthList.length - index - 1]
                let color = ""
                let tong = 0
                for (let i = 0; i < element.color.length; i++) {
                    const el = element.color[i]
                    tong += el.ref * element.size.length
                    color += `<p>- ${el.value}: ${el.ref} / ${el.ref * element.size.length}`
                }

                const item = document.createElement('div')
                item.className = 'items'
                item.id = `${month}, ${monthList.length - index - 1}`
                PrintBoat.appendChild(item)

                const img = document.createElement('img')
                img.src = element.img
                img.className = 'itemsImage'
                item.appendChild(img)

                const rightBox = document.createElement('div')
                rightBox.style = 'display: block; width: calc(100% - 200px); overflow: hidden;'
                item.appendChild(rightBox)

                const label = document.createElement('div')
                label.className = 'itemLabel'
                label.innerHTML = `
                    <h2>${element.name.toUpperCase()}</h2>
                    <p>Ngày: ${element.day}/${month} </p>
                    <p>Size: ${element.size.toString().toUpperCase()} </p>
                    <p><label style="padding: 20px;">
                    <p>${color} </p>
                    <p>Tổng: ${tong} </p>
                    </label>
                    <h5 style="color: #db2303; padding-top: 20px;">
                    <p># ${element.code} </p>
                    <p>- ${element.actor} </p>
                    <p>- ${element.shirt} </p>
                    </h5>
                `
                rightBox.appendChild(label)

                const btnBox = document.createElement('div')
                btnBox.style = 'display: flex; height: 50px; width: 80px; margin-left: calc(100% - 100px); margin-top: 10px;'
                rightBox.appendChild(btnBox)

                const editBtn = document.createElement('div')
                editBtn.style = "background-image: url('icon/compose.png');"
                editBtn.className = 'viewBtn'
                btnBox.appendChild(editBtn)

                const removeBtn = document.createElement('div')
                removeBtn.style = "background-image: url('icon/trash.png');"
                removeBtn.className = 'viewBtn'
                btnBox.appendChild(removeBtn)

                removeBtn.addEventListener('click', () => {
                    monthList.splice(monthList.length - index - 1, 1)
                    reDrawShirtList()
                    localStorage.setItem(user, JSON.stringify(rmb))
                })

                editBtn.addEventListener('click', () => {
                    setedit = {
                        ref: monthList.length - index - 1,
                        month: month
                    }
                    typeShirtBox(element)
                })
            }
        }
    }

    reDrawShirtList()

    function addColor(set) {
        const shirtFcl = document.createElement('div')
        shirtFcl.className = 'addColor'
        addColorsList.appendChild(shirtFcl)

        const shirtFclText = document.createElement('input')
        shirtFclText.type = 'text'
        shirtFclText.className = 'addColorTypeCl'
        shirtFclText.style = 'width: 65%;'
        shirtFcl.appendChild(shirtFclText)

        shirtFcl.innerHTML += ': '

        const shirtFclNumber = document.createElement('input')
        shirtFclNumber.type = 'number'
        shirtFclNumber.className = 'addColorTypeNb'
        shirtFclNumber.value = set ? set.ref : ""
        shirtFclNumber.min = 0
        shirtFclNumber.style = 'width: 15%; text-align: center;'
        shirtFcl.appendChild(shirtFclNumber)

        const shirtFclrmv = document.createElement('div')
        shirtFclrmv.className = 'removeColor'
        shirtFcl.appendChild(shirtFclrmv)

        shirtFclrmv.addEventListener('click', () => {
            shirtFcl.remove()
        })
    }

    function typeShirtBox(set) {
        addShirtBox.style.display = 'block'
        shirtName.value = set ? set.name : ""
        shirtSize.value = set ? set.size.toString() : ""
        addImage.src = set ? set.img : 'icon/image.png'
        shirtCode.value = set ? set.code : 0

        if (set) {
            addColorsList.innerHTML = `<div class="addColor">
                <input type="text" value="${set.color[0].value}" class="addColorTypeCl" style="width: 65%;">:
                <input type="number" value="${set.color[0].ref}" class="addColorTypeNb" style="width: 15%; text-align: center;" min="0">
            </div>`
            for (let index = 1; index < set.color.length; index++) {
                const element = set.color[index]
                addColor(element)
            }
            const rvl = document.getElementsByClassName("addColorTypeCl")
            for (let index = 1; index < rvl.length; index++) {
                rvl[index].value = set.color[index].value
            }
        } else {
            addColorsList.innerHTML = `<div class="addColor">
                <input type="text" name="" id="" value="" class="addColorTypeCl" style="width: 65%;">:
                <input type="number" name="" id="" value="0" class="addColorTypeNb" style="width: 15%; text-align: center;" min="0">
            </div>`
        }

        rday.innerHTML = ""
        for (let index = 1; index <= 31; index++) {
            const newOption = document.createElement('option')
            newOption.text = ("0" + index).slice(-2)
            if (index == (set ? set.day : tday)) newOption.selected = true
            rday.appendChild(newOption)
        }

        ryear.innerHTML = ""
        for (let index = 0; index < rmb.year.length; index++) {
            const newOption = document.createElement('option')
            newOption.text = rmb.year[index]
            if (newOption.text == (set ? set.year : tyear)) newOption.selected = true
            ryear.appendChild(newOption)
        }

        rmonth.innerHTML = ""
        for (let index = 1; index <= 12; index++) {
            const newOption = document.createElement('option')
            newOption.text = ("0" + index).slice(-2)
            if (index == (set ? set.month : tmonth)) newOption.selected = true
            rmonth.appendChild(newOption)
        }

        ractor.innerHTML = ""
        for (let index = 0; index < rmb.actor.length; index++) {
            const element = rmb.actor[index];
            if (element !== 'Tất cả') {
                const newOption = document.createElement('option')
                newOption.text = element
                if (set && element == (set ? set.actor : "")) newOption.selected = true
                ractor.appendChild(newOption)
            }
        }

        rshirt.innerHTML = ""
        for (let index = 0; index < rmb.shirts.length; index++) {
            const element = rmb.shirts[index];
            if (element !== 'Tất cả') {
                const newOption = document.createElement('option')
                newOption.text = element
                if (set && element == (set ? set.shirt : "")) newOption.selected = true
                rshirt.appendChild(newOption)
            }
        }
    }

    function addCheckBox(e) {
        const arr = rmb[e]
        for (let index = 0; index < arr.length; index++) {
            const newoj = document.createElement("label")
            newoj.className = "checkbox"
            newoj.innerHTML = `<input type="radio" name="${e}-radio"${index === 0 ? ' checked="checked"' : ''}> ${arr[index]}`
            clickEvent(newoj, e)
            if (e === 'actor') {
                actorBox.appendChild(newoj)
            } else {
                shirtsBox.appendChild(newoj)
            }
        }
    }

    addCheckBox('shirts')
    addCheckBox('actor')
    //addEventListener
    reloadBtn.addEventListener("click", () => window.location.reload())

    monthBox.addEventListener("click", () => {
        resetView()
    })

    yearBox.addEventListener("click", () => {
        resetView()
    })
    
    function clickEvent(oj, key) {
        oj.addEventListener("click", () => {
            resetView()
        })
    }

    sideBtn.addEventListener("click", () => {
        if (buttonBox.style.left === "calc(var(--sidebar-size) + 5px)") {
            buttonBox.style.left = "5px"
            sideBar.style.left = "var(--icon-size-off)"
        } else {
            buttonBox.style.left = "calc(var(--sidebar-size) + 5px)"
            sideBar.style.left = "0"
        }
    })

    boLoc.addEventListener("click", () => {
        if (boLocCheck.checked) {
            boLocCheck.checked = false
        } else {
            boLocCheck.checked = true
        }
        resetView()
    })

    boLocCheck.addEventListener("click", () => {
        resetView()
    })

    function addEditBoxType(i) {
        const event = rmb[editBoxShow]
        const newDiv = document.createElement("div")
        newDiv.style = 'display: inline-flex;'
        editList.appendChild(newDiv)

        const newInputText = document.createElement("input")
        newInputText.type = 'text'
        newInputText.className = 'editlisttype'
        newInputText.value = typeof(i) === 'number' ? event[i] : ''
        newDiv.appendChild(newInputText)

        const newRmv = document.createElement("div")
        newRmv.className = 'editlistrmv'
        newRmv.addEventListener('click', () => {
            newDiv.remove()
        })
        newDiv.appendChild(newRmv)
    }

    editYear.addEventListener("click", () => {
        editBox.style.display = "block"
        editBoxShow = "year"
        for (let i = 0; i < rmb.year.length; i++) {
            addEditBoxType(i)
        }
    })

    addBtn.addEventListener('click', () => {
        addEditBoxType()
    })

    editActor.addEventListener("click", () => {
        editBox.style.display = "block"
        editBoxShow = "actor"
        for (let i = 0; i < rmb.actor.length; i++) {
            addEditBoxType(i)
        }
    })

    editShirts.addEventListener("click", () => {
        editBox.style.display = "block"
        editBoxShow = "shirts"
        for (let i = 0; i < rmb.shirts.length; i++) {
            addEditBoxType(i)
        }
    })

    applyBtn.addEventListener("click", () => {
        rmb[editBoxShow] = []
        const relements = document.getElementsByClassName('editlisttype')
        for (let index = 0; index < relements.length; index++) {
            rmb[editBoxShow][index] = relements[index].value
        }
        localStorage.setItem(user, JSON.stringify(rmb))
        editList.innerHTML = ""
        editBox.style.display = "none"
        if (editBoxShow === 'year') {
            yearBox.innerHTML = ''
            addOption("option", yearBox, rmb.year)
        } 
        else if (editBoxShow === 'actor') {
            actorBox.innerHTML = '<b>Shop</b>'
            addCheckBox('actor')
        } else {
            shirtsBox.innerHTML = '<b>Loại</b>'
            addCheckBox('shirts')
        }
    })

    cancelBtn.addEventListener("click", () => {
        editList.innerHTML = ""
        editBox.style.display = "none"
    })

    addShirtBtn.addEventListener("click", () => {
        setedit = false
        typeShirtBox()
    })

    addSBtn.addEventListener('click', () => {
        addColor()
    })

    applySBtn.addEventListener('click', () => {
        const textColor = document.getElementsByClassName('addColorTypeCl')
        const numberColor = document.getElementsByClassName('addColorTypeNb')
        const newArr = []
        if (setedit) { 
            rmb.shirtList[setedit.month].splice(setedit.ref, 1)
            reDrawShirtList()
        }
        for (let index = 0; index < textColor.length; index++) {
            newArr.push({ value: textColor[index].value, ref: numberColor[index].value })
        }

        const newKey = `${rmonth.value}/${ryear.value}`
        if (!rmb.shirtList[newKey]) rmb.shirtList[newKey] = []

        rmb.shirtList[newKey].push({
            color: newArr,
            name: shirtName.value,
            size: shirtSize.value.split(','),
            day: rday.value,
            month: rmonth.value,
            year: ryear.value,
            actor: ractor.value,
            shirt: rshirt.value,
            code: shirtCode.value,
            img: addImage.src
        })

        localStorage.setItem(user, JSON.stringify(rmb))
        reDrawShirtList()
        addShirtBox.style.display = 'none'
    })

    cancelSBtn.addEventListener('click', () => {
        addShirtBox.style.display = 'none'
    })

    addImageBtn.addEventListener('change', (event) => {
        const image = event.target.files[0]
        const reader = new FileReader()

        reader.addEventListener('load', () => {
            addImage.src = reader.result
        })
    
        reader.readAsDataURL(image)
    })

    searchBox.addEventListener('input', () => resetView())
}