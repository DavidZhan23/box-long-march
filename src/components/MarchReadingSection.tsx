const MARCH_MAP_SRC = '/images/长征图片.jpg'

export function MarchReadingSection() {
  return (
    <section
      className="home-march-reading"
      aria-labelledby="home-march-reading-title"
    >
      <div className="home-march-reading-head">
        <h2 id="home-march-reading-title" className="home-march-reading-title">
          长征路线图
        </h2>
        {/* <p className="home-march-reading-sub">四支主力部队 · 路线与时间概览</p> */}
      </div>

      <div className="home-march-reading-card">
        <div className="home-march-reading-visual">
        {/* 红军长征路线图 */}
          <p className="home-march-reading-map-caption"></p>
          <figure className="home-march-reading-figure">
            <img
              className="home-march-reading-img"
              src={MARCH_MAP_SRC}
              alt="红军长征路线示意图：各路红军行军路线与关键节点"
              loading="lazy"
              decoding="async"
            />
          </figure>
          {/* 时间
          <p className="home-march-reading-map-meta">1934.10 — 1936.10</p> */}
        </div>

        <div className="home-march-reading-panel">
          <section className="home-read-section">
            <h3 className="home-read-heading">
              <span className="home-read-heading-num">1</span>
              红一方面军（中央红军，大部队）
            </h3>
            <p className="home-read-lead">
              红军主力部队，从江西瑞金出发，到达陕北吴起镇。长征时间 1934.10～1935.10。
            </p>
            <ul className="home-read-steps">
              <li>
                <span className="home-read-step-num">①</span>
                <span>湘江战役。8 万人剩 3 万人</span>
              </li>
              <li>
                <span className="home-read-step-num">②</span>
                <span>遵义会议。毛主席被选为党的核心领导。</span>
              </li>
              <li>
                <span className="home-read-step-num">③</span>
                <span>四渡赤水。战争史上神操作</span>
              </li>
              <li>
                <span className="home-read-step-num">④</span>
                <span>巧渡金沙江。</span>
              </li>
              <li>
                <span className="home-read-step-num">⑤</span>
                <span>飞夺泸定桥</span>
              </li>
              <li>
                <span className="home-read-step-num">⑥</span>
                <span>懋功会师。红一与红四（张国焘领导）会师、混编。</span>
              </li>
              <li>
                <span className="home-read-step-num">⑦</span>
                <span>
                  右路军（毛主席带领），爬雪山、过草地，到达陕北吴起镇；左路军（张国焘带领，红四方面军为主）南下，损失惨重。与正在长征的红二、红六军团碰头。红二、红六军团整编为红二方面军。红二、红四方面军共同北上。最终与红一在会宁会师。
                </span>
              </li>
            </ul>
          </section>

          <section className="home-read-section">
            <h3 className="home-read-heading">
              <span className="home-read-heading-num">2</span>
              红二方面军
            </h3>
            <p className="home-read-lead">
              从湘鄂川黔根据地出发，到宁夏将台堡结束。长征时间 1935.11～1936.10。
            </p>
            <p className="home-read-p">
              湘鄂川黔根据地的红二、红六军团（小部队），在向西长征中与左路军（张国焘带领，红四方面军为主）碰头，红二、红六军团整编为红二方面军。与红四北上，最终在甘肃会宁一、二、四三大方面军会师。
            </p>
          </section>

          <div className="home-read-split">
            <section className="home-read-section home-read-section--half">
              <h3 className="home-read-heading">
                <span className="home-read-heading-num">3</span>
                红四方面军（大部队）
              </h3>
              <p className="home-read-p">
                川陕地区出发，长征时间 1935.3～1936.10，到达甘肃会宁。三大主力会师。
              </p>
            </section>
            <section className="home-read-section home-read-section--half">
              <h3 className="home-read-heading">
                <span className="home-read-heading-num">4</span>
                红二十五军（小部队）
              </h3>
              <p className="home-read-p">
                从鄂豫皖革命根据地出发，到陕西永坪镇。长征时间 1934.11～1935.9，是四支部队里最早到达陕北的。
              </p>
            </section>
          </div>
        </div>
      </div>
    </section>
  )
}
