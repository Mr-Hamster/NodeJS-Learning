const mongoose = require('mongoose');

const Product = require('../models/product');

exports.products_get_all = (req, res, next) => {
	Product.find()
		.select('name price _id productImage')
		.exec()
		.then(data => {
			const response = {
				count: data.length,
				products: data
			};
			res.status(200).json(response);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};

exports.products_post_product = (req, res, next) => {
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price,
		productImage: req.file.path
	});
	product
		.save()
		.then(result => {
			const { name, price, _id } = result;
			res.status(201).json({
				message: 'Created product successfully',
				createdProduct: {
					name: name,
					price: price,
					_id: _id,
					productImage: req.file.path
				}
			});
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			});
		});
};

exports.products_get_product = (req, res, next) => {
	const id = req.params.productId;
	Product.findById(id)
		.select('name price _id')
		.exec()
		.then(data => {
			if (data) {
				res.status(200).json({
					product: data
				});
			} else {
				res.status(404).json({
					message: 'No valid entry found for this ID'
				});
			}			
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: err }); 
		});
};

exports.products_update_product = (req, res, next) => {
	const id = req.params.productId;
	const updateOps = {};
	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value;
	}
	Product.update({ _id: id }, { $set: updateOps })
		.exec()
		.then(result => {
			res.status(200).json({
				message: 'Product successfully updated'
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};

exports.products_delete_product = (req, res, next) => {
	const id = req.params.productId
	Product.remove({ _id: id })
		.exec()
		.then(result => {
			res.status(200).json({
				message: 'Product successfully deleted',
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		})
};