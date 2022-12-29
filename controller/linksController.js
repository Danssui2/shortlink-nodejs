const Url = require('../models/Url.js')
const User = require('../models/User.js')
const urlValidator = require('../utils/Utils.js')
const { nanoid } = require('nanoid')
const dotenv = require('dotenv')

dotenv.config()

const createLink =  async (req, res) => {
    const {oriUrl, id} = req.body
    const email = req.user?.email
    
    const date = new Date()
    
    if (!req.user) return res.status(403).send('User Not Found!')
    
    if (urlValidator(oriUrl)) {
      try {
        const user = await User.findOne({email})
        if (!user) return res.status(404).send('User Not Found')
        
        const existUrl = await Url.findOne({oriUrl})
        
        if (existUrl) {
          user?.links.push(existUrl.uID)
          await user.save()
          addOwner(oriUrl, email)
        } else {
          let newMiniurl = process.env.BASE_URL + 'go/' + id
          const newLink = await Url.create({
            uID: nanoid(8),
            urlID: id,
            oriUrl: oriUrl,
            miniUrl: newMiniurl,
            owner: email,
            date:  date.toLocaleDateString(),
          })
          
          user?.links.push(newLink.uID)
          await user.save()
          return res.json(newLink)
        }
      } catch (err) {
        res.status(500).json("Server Error")
        console.log(err)
      }
    } else {
      res.status(400).json("Invalid Link")
      console.log("Invalid Link")
    }
}

const addOwner = async (ori, email) => {
  try {
    const link = await Url.findOne({ori})
    if (!link) return console.log('Link not found') 
    link.owner.push(email)
    await link.save()
    console.log(link)
  } catch (err) {
    console.log(err)
  }
}

const removeOwner = async (req, res) => {
  const uID = req.body.uID
  const email = req?.user?.email
  
  if (!req.user) return res.status(403).send('User Not Found!')
  
  try {
    const link = await Url.findOne({uID: uID})
    if (!link) return res.status(404).send('Link not valid')
    link.owner.pull(email)
    await link.save()
    
    const user = await User.findOne({email})
    user.links.pull(uID)
    await user.save()
    return res.send("success")
  } catch (err) {
    console.log(err)
    return res.status(500)
  }
    checkInvalidLink()
}

const updateLink = async (req, res) => {
  const { ori, urlID, uID } = req.body
  
  try {
    const link = await Url.findOne({uID: uID})
    
    if (!link) return res.status(404).send('Link not valid')
    if (!urlValidator(ori)) return res.status(400).send('Link not valid')
    let newMiniurl = process.env.BASE_URL + 'go/' + urlID

    link.oriUrl = ori
    link.urlID = urlID
    link.miniUrl = newMiniurl
    await link.save()
    return res.json(link)
  } catch (err) {
    console.log(err)
    return res.status(500)
  }
}

const checkInvalidLink = async () => {
  try {
    const invalidLink = await Url.find({owner: []})
    console.log(invalidLink)
    invalidLink?.forEach((i) => deleteLink(i.uID))
  } catch (err) {
    console.log(err)
    return res.status(500)
  }
}

const deleteLink = async (uID) => {
  try {
    const del = await Url.deleteOne({uID: uID})
    console.log("Success deleted " + del)
  } catch (err) {
    console.log(err)
    return res.status(500)
  }
}

const getLink = async (req, res) => {
  const email = req.user.email
  if (!email) return res.status(403).send('Unauthorized')
  
  try {
    const user = await User.findOne({email})
    const userLinks = user?.links
    
    const links = await Url.find({ 'uID': { $in: userLinks } })
    res.status(200).json(links)
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  createLink,
  addOwner,
  removeOwner,
  updateLink,
  getLink,
}