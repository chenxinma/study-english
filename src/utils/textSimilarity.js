/**
 * Text Similarity Utilities
 * Contains various algorithms for calculating text similarity
 */

/**
 * Calculate cosine similarity between two arrays of numbers
 * @param {Array<number>} vecA - First vector
 * @param {Array<number>} vecB - Second vector
 * @returns {number} Cosine similarity score
 */
function cosineSimilarity(vecA, vecB) {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    magnitudeA += Math.pow(vecA[i], 2);
    magnitudeB += Math.pow(vecB[i], 2);
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0; // Cannot divide by zero
  }

  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Calculate Levenshtein distance between two strings
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Distance between the strings
 */
function levenshteinDistance(str1, str2) {
  const matrix = [];

  // Initialize matrix
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  // Fill the matrix
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Calculate similarity based on Levenshtein distance
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Similarity score between 0 and 1
 */
function levenshteinSimilarity(str1, str2) {
  if (!str1 && !str2) return 1;
  if (!str1 || !str2) return 0;
  if (str1 === str2) return 1;

  const distance = levenshteinDistance(str1, str2);
  const maxLength = Math.max(str1.length, str2.length);
  
  return 1 - (distance / maxLength);
}

/**
 * Calculate Jaccard similarity between two sets
 * @param {Array} setA - First set
 * @param {Array} setB - Second set
 * @returns {number} Jaccard similarity score
 */
function jaccardSimilarity(setA, setB) {
  const setASet = new Set(setA);
  const setBSet = new Set(setB);

  const intersection = new Set([...setASet].filter(x => setBSet.has(x)));
  const union = new Set([...setASet, ...setBSet]);

  if (union.size === 0) {
    return 1; // Both sets are empty
  }

  return intersection.size / union.size;
}

/**
 * Calculate Dice coefficient similarity between two sets
 * @param {Array} setA - First set
 * @param {Array} setB - Second set
 * @returns {number} Dice coefficient score
 */
function diceSimilarity(setA, setB) {
  const setASet = new Set(setA);
  const setBSet = new Set(setB);

  const intersection = new Set([...setASet].filter(x => setBSet.has(x)));
  const sumOfSizes = setASet.size + setBSet.size;

  if (sumOfSizes === 0) {
    return 1; // Both sets are empty
  }

  return (2 * intersection.size) / sumOfSizes;
}

/**
 * Calculate overlap coefficient between two sets
 * @param {Array} setA - First set
 * @param {Array} setB - Second set
 * @returns {number} Overlap coefficient score
 */
function overlapSimilarity(setA, setB) {
  const setASet = new Set(setA);
  const setBSet = new Set(setB);

  const intersection = new Set([...setASet].filter(x => setBSet.has(x)));
  const minSize = Math.min(setASet.size, setBSet.size);

  if (minSize === 0) {
    return 0; // At least one set is empty
  }

  return intersection.size / minSize;
}

/**
 * Tokenize text into n-grams
 * @param {string} text - Input text
 * @param {number} n - Size of n-grams
 * @returns {Array<string>} Array of n-grams
 */
function ngramTokenizer(text, n = 2) {
  if (!text) return [];
  
  const tokens = [];
  const cleanText = text.replace(/\s+/g, '');
  
  for (let i = 0; i <= cleanText.length - n; i++) {
    tokens.push(cleanText.substr(i, n));
  }
  
  return tokens;
}

/**
 * Calculate TF-IDF vector for a text document
 * @param {Array<string>} documents - Collection of documents
 * @param {string} document - Target document to calculate TF-IDF for
 * @returns {Array<number>} TF-IDF vector
 */
function calculateTfIdf(documents, document) {
  // This is a simplified version of TF-IDF calculation
  // In a real implementation, you would need to implement full TF-IDF
  
  // For now, return a placeholder implementation
  const words = document.toLowerCase().split(/\s+/);
  const uniqueWords = [...new Set(words)];
  
  // Create a frequency map
  const freqMap = {};
  words.forEach(word => {
    freqMap[word] = (freqMap[word] || 0) + 1;
  });
  
  // Return frequencies normalized to 0-1 range
  const maxFreq = Math.max(...Object.values(freqMap));
  return uniqueWords.map(word => maxFreq > 0 ? (freqMap[word] || 0) / maxFreq : 0);
}

export {
  cosineSimilarity,
  levenshteinDistance,
  levenshteinSimilarity,
  jaccardSimilarity,
  diceSimilarity,
  overlapSimilarity,
  ngramTokenizer,
  calculateTfIdf
};