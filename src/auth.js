import {Strategy, ExtractJwt} from 'passport-jwt'
import {Passport} from 'passport'

export let configurePassport =
function (model: DatabaseObject, passport: Passport): void {
  let opts: any = {}
  opts.secretOrKey = model.tokenSalt
  opts.jwtFromRequest = ExtractJwt.fromHeader('token')

  let strategy = new Strategy(opts, (jwtPayload, done) => {
    model.user.findOne({ _id: jwtPayload._doc._id }).exec()
    .then((account) => {
      account === undefined ? done(undefined, false) : done(undefined, account)
    }, (err) => {
      done(err, false)
    })
  })

  passport.use(strategy)
}
