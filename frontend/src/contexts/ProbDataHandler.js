import axios from 'axios';

class ProbDataHandler {
  constructor() {
    this.mapels = ["PABP", "PPKN", "B.Indonesia", "MTK Wajib", "Sejarah Indonesia", "B.Inggris Wajib", "Seni Budaya", "PJOK", "PKWU", "MTK Peminatan", "Biologi", "Fisika", "Kimia", "Ekonomi", "B.Inggris Terapan"];
    this.semesters = ["1", "2", "3", "4", "5"];
  }

  formatKey(semester, mapel) {
    return `s${semester}_${mapel.replace(/\s+/g, '_')}`;
  }

  async submitAverageScores(averageScores, setProbData) {
    const averageScoresArray = Object.values(averageScores);

    const requestBody = {
      x1: averageScoresArray[0],
      x2: averageScoresArray[1],
      x3: averageScoresArray[2],
      x4: averageScoresArray[3],
      x5: averageScoresArray[4],
      x6: averageScoresArray[5],
      x7: averageScoresArray[6],
      x8: averageScoresArray[7],
      x9: averageScoresArray[8],
      x10: averageScoresArray[9],
      x11: averageScoresArray[10],
      x12: averageScoresArray[11],
      x13: averageScoresArray[12],
      x14: averageScoresArray[13],
      x15: averageScoresArray[14]
    };

    try {
      const response = await axios.post('http://localhost:5000/api/nb/naiveBayesClassifier', requestBody);
      const probDataFromServer = response.data.probData;
      const sortedProbData = probDataFromServer.sort((a, b) => b.p_yes - a.p_yes);
      setProbData(sortedProbData);

      const rekomendasiElement = document.getElementById('rekomendasi');
      if (rekomendasiElement) {
        rekomendasiElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (error) {
      console.error('Error submitting average scores:', error);
    }
  }

  convertToGrade(score) {
    const numericScore = parseFloat(score);
    if (numericScore >= 90) {
      return "A";
    } else if (numericScore >= 85) {
      return "A-";
    } else if (numericScore >= 80) {
      return "B+";
    } else if (numericScore >= 75) {
      return "B";
    } else if (numericScore >= 70) {
      return "B-";
    } else {
      return "CDE";
    }
  }

  biggerOrSame(grade1, grade2) {
    const gradeOrder = ["A", "A-", "B+", "B", "B-", "CDE"];
    const index1 = gradeOrder.indexOf(grade1);
    const index2 = gradeOrder.indexOf(grade2);
    return index1 <= index2;
  }
  
  getGradeRank(grade) {
    const gradeOrder = ["A", "A-", "B+", "B", "B-", "CDE"];
    const index = gradeOrder.indexOf(grade);
    return index;
  }
  
}

export default ProbDataHandler;
