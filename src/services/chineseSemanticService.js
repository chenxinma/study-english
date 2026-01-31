import { pipeline, env } from '@huggingface/transformers';

/**
 * 设置模型缓存目录
 */
// env.remoteHost = "https://hf-mirror.com";
env.allowRemoteModels = false;
env.allowLocalModels = true;

/**
 * 计算两个向量的余弦相似度
 * @param {Array<number>} vec1 - 第一个向量
 * @param {Array<number>} vec2 - 第二个向量
 * @returns {number} 余弦相似度，范围在 -1 到 1 之间
 */
const cosineSimilarity = (vec1, vec2) => {
  if (!vec1 || !vec2 || vec1.length !== vec2.length) {
    return 0;
  }

  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    norm1 += vec1[i] * vec1[i];
    norm2 += vec2[i] * vec2[i];
  }

  const denominator = Math.sqrt(norm1) * Math.sqrt(norm2);
  
  if (denominator === 0) {
    return 0;
  }

  return dotProduct / denominator;
};

/**
 * 归一化向量 - 将向量缩放为单位向量
 * @param {Array<number>} vec - 输入向量
 * @returns {Array<number>} 归一化后的向量
 */
const normalizeVector = (vec) => {
  if (!vec) return [];
  
  let norm = 0;
  for (let i = 0; i < vec.length; i++) {
    norm += vec[i] * vec[i];
  }
  
  norm = Math.sqrt(norm);
  
  if (norm === 0) {
    return vec;
  }
  
  return vec.map(v => v / norm);
};

/**
 * Chinese Semantic Analysis Service
 * 使用 bge-small-zh-v1.5 模型在浏览器环境下实现中文文本语义相似度比较
 */
class ChineseSemanticService {
  constructor() {
    this.embeddingPipe = null;
    this.isModelLoaded = false;
    this.embeddingCache = new Map();
    this._initializeModel();
  }

  /**
   * 初始化 bge-small-zh-v1.5 模型
   */
  async _initializeModel() {
    try {
      console.log('正在加载 bge-small-zh-v1.5 模型...');
      this.embeddingPipe = await pipeline('feature-extraction', 'bge-small-zh-v1.5', {
                        // 优化配置：减少内存占用，加快加载速度
                        device: 'wasm',   // 浏览器端仅支持CPU
                        cache_dir: './models'
                    });
      this.isModelLoaded = true;
      console.log('模型加载成功');
    } catch (error) {
      console.error('模型加载失败:', error);
      this.isModelLoaded = false;
    }
  }

  /**
   * 将文本转换为归一化的向量表示
   * @param {string} text - 输入文本
   * @returns {Promise<Array<number>>} 归一化后的文本向量
   */
  async getTextEmbedding(text) {
    if (!text || typeof text !== 'string') {
      return [];
    }

    // 检查缓存
    if (this.embeddingCache.has(text)) {
      return this.embeddingCache.get(text);
    }

    // 等待模型加载完成
    if (!this.isModelLoaded) {
      console.log('等待模型加载...');
      while (!this.isModelLoaded) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    if (!this.embeddingPipe) {
      throw new Error('模型未加载成功');
    }

    try {
      // 获取特征提取结果
      const features = await this.embeddingPipe(text, {
        pooling: 'mean',
        normalize: false
      });

      // 将张量转换为普通数组
      const embedding = features[0].tolist();

      // 归一化向量
      const normalizedEmbedding = normalizeVector(embedding);

      // 缓存结果
      this.embeddingCache.set(text, normalizedEmbedding);

      return normalizedEmbedding;
    } catch (error) {
      console.error('获取文本向量失败:', error);
      return [];
    }
  }

  /**
   * 比较两个中文文本的语义相似度
   * @param {string} text1 - 第一个文本
   * @param {string} text2 - 第二个文本
   * @returns {Promise<number>} 相似度分数，范围在 0 到 1 之间
   */
  async compareSimilarity(text1, text2) {
    if (!text1 || !text2) {
      return 0;
    }

    // 直接比较
    if (text1.toLowerCase() === text2.toLowerCase()) {
      return 1;
    }

    try {
      // 获取两个文本的向量表示
      const [embedding1, embedding2] = await Promise.all([
        this.getTextEmbedding(text1),
        this.getTextEmbedding(text2)
      ]);

      // 计算余弦相似度
      const similarity = cosineSimilarity(embedding1, embedding2);

      // 将范围从 -1 到 1 转换为 0 到 1
      return (similarity + 1) / 2;
    } catch (error) {
      console.error('比较相似度失败:', error);
      return 0;
    }
  }

  /**
   * 检查模型是否已加载
   * @returns {boolean} 模型加载状态
   */
  isReady() {
    return this.isModelLoaded;
  }

  /**
   * 清除缓存
   */
  clearCache() {
    this.embeddingCache.clear();
  }

  /**
   * 获取缓存大小
   * @returns {number} 缓存中的条目数
   */
  getCacheSize() {
    return this.embeddingCache.size;
  }
}

export default new ChineseSemanticService();