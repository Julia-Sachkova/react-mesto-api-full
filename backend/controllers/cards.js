const Card = require('../models/card');

const NoAccess = require('../errors/NoAccess');
const NotFound = require('../errors/NotFound');
const NotValidCode = require('../errors/NotValidCode');

module.exports.getCard = (_req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((card) => res.send(card))
    .catch((err) => {
      next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({
    name,
    link,
    owner,
  })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new NotValidCode('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { id } = req.params;

  const cardDelete = () => {
    Card.findById(id)
      .orFail(new NotFound('Карточка не найдена'))
      .then((card) => {
        if (!card.owner.equals(req.user._id)) {
          return next(new NoAccess('Нельзя удалить чужую карточку'));
        }
        return card.remove()
          .then(() => res.send({ message: 'Карточка удалена' }));
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          next(new NotValidCode('Введен некорректный id'));
        } else {
          next(err);
        }
      });
  };

  Card.findById(req.params.cardId)
    .orFail(new NotFound('Карточка не найдена'))
    .then((card) => {
      if (req.user._id !== card.owner.toString()) {
        throw new NoAccess('Вы не можете удалить данную карточку');
      }

      return cardDelete();
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotValidCode('Введен некорректный id'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFound('Карточка не найдена'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotValidCode('Введен некорректный id'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFound('Карточка не найдена'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotValidCode('Введен некорректный id'));
      } else {
        next(err);
      }
    });
};
