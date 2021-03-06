const Discord = require('discord.js');
const client = new Discord.Client({partials: ['MESSAGE', 'REACTION']});
const {prefix, token, DBFile, guilds} = require('./config.json');
const ReactionHandler = require('./reactionHandler.js');

const Parser = require('./parser.js');
const parser = new Parser(client, DBFile);

client.login(token);

client.on('ready', () => 
{
    console.log(`logged in as ${client.user.tag}`);
});

client.on('message', message => 
{
    if(!message.content.startsWith(prefix) || message.content.length == prefix.length || message.author.bot || !guilds.includes(message.guild.id))
    {
        return;
    }

    console.log("caught a command: " + message.content);
    parser.execute(message, prefix);
});

//Get messages for reactions and hand them off to the reaction handler
client.on('messageReactionAdd', async (reaction, user) => 
{
    if(user.bot || !guilds.includes(reaction.message.guild.id))
        return;

    console.log(`caught reaction: ${reaction.emoji.name} ${reaction.emoji.id}`);

    if(reaction.partial)
    {
        try
        {
            await reaction.fetch();
        }catch(e)
        {
            console.log(`failed to fetch message from reaction: ${e}`);
            return;
        }
    }

    ReactionHandler.processReaction(reaction, user);
});

client.on('messageReactionRemove', async (reaction, user) => 
{
    if(user.bot || !guilds.includes(reaction.message.guild.id))
        return;

    console.log(`caught unreaction: ${reaction.emoji.name} ${reaction.emoji.id}`);

    if(reaction.partial)
    {
        try
        {
            await reaction.fetch();
        }catch(e)
        {
            console.log(`failed to fetch message from reacthion: ${e}`);
            return;
        }
    }

    ReactionHandler.processUnreaction(reaction, user);
});