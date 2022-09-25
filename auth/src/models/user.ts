import mongoose from 'mongoose'

// Defines properties to create a new user
interface UserAttrs {
	email: string
	password: string
}

// Defines properties for user model
interface UserModel extends mongoose.Model<UserDoc> {
	build(attrs: UserAttrs): UserDoc
}

// Defines properties for user document
interface UserDoc extends mongoose.Document {
	email: string
	password: string
}

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
})

// Implement custom method 'build' on schema
userSchema.statics.build = (attrs: UserAttrs) => {
	return new User(attrs)
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

export { User }
