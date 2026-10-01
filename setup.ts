//Any initializations will go here
namespace userconfig {
    export const ARCADE_SCREEN_WIDTH = 256
    export const ARCADE_SCREEN_HEIGHT = 192
}

namespace SpriteKind {
    export const Punch = SpriteKind.create()
    export const Explosion = SpriteKind.create()
    export const Upgrade = SpriteKind.create()
    export const Null = SpriteKind.create()
}

const enum meleeAttacks {
    normal,
    ironFist,
    thunderclap,
    needleArm,
    explodeOPunch,
    clusterBlast,
    bombBarrage
}

const enum rangedAttacks {
    normal,
    unibeam,
    railgun,
    incineration,
    plasmaBalls,
    sprayAndPray,
    shootingStars
}
const enum enemyTypes {
    normal,
    fast,
    proj,
    tankyNormal,
    tankyFast,
    tankyProj
}

const enum animationState {
    idleL1,
    idleL2,
    idleR1,
    idleR2,
    moveL1a,
    moveL1b,
    moveL2a,
    moveL2b,
    moveR1a,
    moveR1b,
    moveR2a,
    moveR2b,
    death
}

const animations = [
    assets.animation`idleL1`,
    assets.animation`idleL2`,
    assets.animation`idleR1`,
    assets.animation`idleR2`,
    assets.animation`moveL1a`,
    assets.animation`moveL1b`,
    assets.animation`moveL2a`,
    assets.animation`moveL2b`,
    assets.animation`moveR1a`,
    assets.animation`moveR1b`,
    assets.animation`moveR2a`,
    assets.animation`moveR2b`
    ]

scene.setBackgroundImage(assets.image`background`)
browserEvents.setCursorVisible(false)
game.stats = true

const cursor = sprites.create(assets.image`cursor`, SpriteKind.Null)
let currentAnimation = assets.animation`idleR1`
let angle = 90
cursor.setPosition(128, 100)
cursor.z = 1000

const makeCodeMan = sprites.create(assets.image`playerHitbox`, SpriteKind.Player)
const playerSprite = sprites.create(assets.image`makeCodeManBody`, SpriteKind.Null)
let leftHand = sprites.create(assets.image`leftHand`, SpriteKind.Null)
let rightHand = sprites.create(assets.image`rightHand`, SpriteKind.Null)
makeCodeMan.setFlag(SpriteFlag.Invisible, true)
makeCodeMan.setFlag(SpriteFlag.StayInScreen, true)
playerSprite.setFlag(SpriteFlag.Ghost, true)
makeCodeMan.fx = 350
makeCodeMan.fy = 350

const healthBar: Sprite[] = []
let maxHp = 5
let hp = 5
let hpText = fancyText.create("HP:")
hpText.setPosition(12, 12)
for (let i = 1; i <= 5; i++) {
    let hitPoint = sprites.create(assets.image`healthFull`, SpriteKind.Null)
    hitPoint.setPosition(i * 18 + 12, 12)
    hitPoint.z = 999
    healthBar.push(hitPoint)
}

let punchSide = 0
let melee = meleeAttacks.normal
let ranged = rangedAttacks.normal

let punchDmgBonus = 0
let punchKbBonus = 0
let punchAtkSpeBonus = 0
let punchAtkDelay = 25
let currentPunchDelay = 0

let laserDmgBonus = 0
let laserKbBonus = 0
let laserAtkSpeBonus = 0
let laserAtkDelay = 34
let currentLaserDelay = 0

let enemies: number[] = []
let wave = 1
let spawnTimerMax = 150
let spawnTimer = 75
let spawnCount = 1
for (let i = 0; i < 5; i++) {
    enemies.push(enemyTypes.normal)
}
let waveBeaten = false

let globalHealthBoost = 0
let globalKbBoost = 0

let normalCount = 5
let fastCount = -6
let projCount = -4.5
let tankyNormalCount = -14
let tankyFastCount = -9.5
let tankyProjCount = -24

let upgradePoolNormal = [0, 1, 2, 3, 4, 5, 6]
let upgradePollEpic = [0, 1, 2, 3, 4, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 10, 11, 11, 11, 12, 12, 12, 12, 12, 12, 13, 13, 13, 14, 14, 14]