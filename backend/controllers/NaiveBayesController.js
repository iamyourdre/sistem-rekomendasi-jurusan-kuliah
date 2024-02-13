import NbIpaV1Model from "../models/NaiveBayesV1Model";
import { Sequelize } from "sequelize";
import { erf } from 'mathjs';

export const createTrainingData = async (req, res) => {
  try {
    
    await calcGenre();
    await calcMean();
    await calcStdev();
      
    res.status(200).send({
      message: "Selesai membuat data latih!",
    });

  } catch (error) {
    res.status(500).send({
      message: "Gagal mengimpor data ke database!",
      error: error.message,
    });
  }
};


export const calcGenre = async () => {
  try {
      const genres = await Sample.findAll({
          attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('genre')), 'genre']],
          raw: true,
      });

      const processedData = [];
      const totalData = await Sample.count();

      for (const g of genres) {
          const countGenre = await Sample.count({
              where: {
                  genre: g.genre,
              },
          });
          processedData.push({
              genre: g.genre,
              quantity: countGenre,
          });
      }
      
      for (let i = 0; i < processedData.length; i++) {
        processedData[i].probability = processedData[i].quantity / totalData;
    }

      await NB_dataclass.bulkCreate(processedData);
      
      console.log("calcProbability Done!");
  } catch (error) {
      console.log(error.message);
      throw error; 
  }
};
