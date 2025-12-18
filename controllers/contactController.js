import Contact from "../models/Contact.js"

export const addContact = async (req, res) => {
    try {
        const { userName, countryCode, number } = req.body;

        const newContact = await Contact.create({
            userName,
            countryCode,
            number,
        });

        res.status(201).json(newContact);
    } catch (error) {
        if (error.code === 11000) {
            return res
                .status(400)
                .json({ message: "This country code and number already exist" });
        }

        res.status(500).json({ message: error.message });
    }
};

export const getContact = async (req, res) => {
  try {
    const contacts = await Contact.find()
    res.status(201).json(contacts)
  }
  catch (error) {
    res.status(500).json(error.message)
  }
}

export const editContact = async (req, res) => {
    try {
        const updatedContact = await Contact.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updatedContact);
    } catch (error) {
        if (error.code === 11000) {
            return res
                .status(400)
                .json({ message: "This country code and number already exist" });
        }

        res.status(500).json({ message: error.message });
    }
};

export const getSingleContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    res.status(200).json(contact);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteContact = async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id)
  res.json({ message: "Delete contact" })
}