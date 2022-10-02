import mongoose from 'mongoose'
import { Password } from '../services/password'

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

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		}
	},
	{
		toJSON: {
			transform(doc, response) {
				response.id = response._id
				delete response._id
				delete response.__v
				delete response.password
			}
		}
	}
)

userSchema.pre('save', async function (done) {
	if (this.isModified('password')) {
		const hashed = await Password.toHash(this.get('password'))
		this.set('password', hashed)
	}
	done()
})

// Implement custom method 'build' on schema
userSchema.statics.build = (attrs: UserAttrs) => {
	return new User(attrs)
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

export { User }
