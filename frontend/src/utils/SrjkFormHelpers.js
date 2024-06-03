
export function isLowerSameBigger(grade1, grade2) {
  const gradeOrder = ["A", "A-", "B+", "B", "B-", "CDE"];
  const index1 = gradeOrder.indexOf(grade1);
  const index2 = gradeOrder.indexOf(grade2);

  if (index1 > index2) {
    return -1;
  } else if (index1 < index2) {
    return 1;
  } else {
    return 0;
  }
}
  
// Fungsi untuk menangani paste dari clipboard
export function handlePaste(event) {
  event.preventDefault();
  const clipboardData = event.clipboardData || window.clipboardData;
  const pastedData = clipboardData.getData('text');
  const scores = pastedData.split('\t').map(score => parseInt(score.trim(), 10));

  // Menetapkan nilai-nilai yang dipaste ke input sesuai dengan urutannya
  let updatedFormData = { ...formData }; // Copy the current state

  let index = 0;
  semesters.forEach((semester, semesterIndex) => {
    mapels.forEach((mapel, mapelIndex) => {
      if (scores[index] !== undefined) {
        if(semester > 2 && mapelIndex === 14){
          const key = formatKey(semester, mapel);
          updatedFormData[key] = 0;
          handleInputChange(semester, mapel, updatedFormData[key])
          index--;
        } else {
          const key = formatKey(semester, mapel);
          updatedFormData[key] = scores[index];
          handleInputChange(semester, mapel, updatedFormData[key])
        }
      }
      index++;
    });
  });

  // Set the updated state
  setFormData(updatedFormData);
}

// Fungsi untuk menyimpan nilai input ke state dan cookie
export function handleInputChange(semester, mapel, value) {
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);

  const cookieKey = formatKey(semester, mapel);
  const cookieValue = `${cookieKey}=${value}; expires=${expires.toUTCString()}; path=/`;

  const newFormData = { ...formData, [cookieKey]: value };
  setFormData(newFormData);
  document.cookie = cookieValue;
}

// Fungsi untuk mereset semua nilai input dan hapus cookie
export function resetAllValues() {
  const newFormData = {};
  setFormData(newFormData);
  mapels.forEach(mapel => {
    semesters.forEach(semester => {
      document.cookie = `${formatKey(semester, mapel)}=; path=/;`;
    });
  });
}

export function convertToGrade(score) {
  const numericScore = parseFloat(score)
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