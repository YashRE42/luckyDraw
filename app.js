const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Event = require('./models/event');
const User = require('./models/user');

mongoose.connect('mongodb+srv://re:re@cluster0.quxq3.mongodb.net/luckydraw?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/events', async (req, res) => {
    const events = await Event.find({});
    res.render('events/index', { events })
});

app.get('/recent', async (req, res) => {
    const events = await Event.find({});
    let today = new Date();
    let lastWeekDate = new Date();
    let eventsWithinTheLastWeek = [];
    lastWeekDate.setDate(lastWeekDate.getDate() - 7)
    events.forEach(event => {
        let date = new Date(event.date);
        if (date >= lastWeekDate && date <= today && event.winner) {
            eventsWithinTheLastWeek.push(event);
        }
    });
    res.render('events/recent',{events:eventsWithinTheLastWeek})
});

app.get('/upcoming', async (req, res) => {
    const events = await Event.find({});
    let today = new Date();
    let upcoming = [];
    events.forEach(event => {
        let date = new Date(event.date);
        if (date >= today) {
            upcoming.push(event);
        }
    });
    res.render('events/upcoming',{events:eventsWithinTheLastWeek})
});

app.get('/events/new', (req, res) => {
    res.render('events/new');
})

app.post('/events', async (req, res) => {
    const event = new Event(req.body.event);
    await event.save();
    res.redirect(`/events/${event._id}`)
})

app.get('/events/:id', async (req, res,) => {
    const event = await Event.findById(req.params.id)
    res.render('events/show', { event });
});

app.get('/events/:id/pickwinner', async (req, res) => {
    const event = await Event.findById(req.params.id);
    const winner = await User.findById(event.participants[Math.floor(Math.random() * event.participants.length)]);
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, {winner : winner.name});
    res.redirect(`/events/${updatedEvent._id}`);
})

app.get('/', (req, res) => {
    res.render('users/input');
})

app.post('/users', async (req, res) => {
    const existingUser = await User.find({name : req.body.user.name});
    if (existingUser.length === 0) {
        const user = new User({
            name: req.body.user.name,
            tickets: 0
        });
        await user.save();
        res.redirect(`/${user._id}`);
    } else {
        res.redirect('/' + existingUser[0]._id);
    }
})

app.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    const events = await Event.find();
    if (user) {
        res.render('users/show', {
            user: user,
            events: events,
        })
    } else {
        res.redirect('/');
    }
});

app.post('/tickets/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {tickets: user.tickets + 1 });
        res.redirect(`/${updatedUser._id}`)
    } else {
        res.redirect('/');
    }
});

app.post('/participate/:eventId/:userId', async (req, res) => {
    const user = await User.findById(req.params.userId);
    const event = await Event.findById(req.params.eventId);
    if (user.tickets > 0 && !event.participants.includes(user._id)) {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, {tickets: user.tickets - 1 });
        let participants = event.participants;
        participants.push(user);
        const updatedEvent = await Event.findByIdAndUpdate(req.params.eventId, { participants: participants});
    }
    res.redirect(`/${user._id}`)
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Serving on port 3000')
})