//Classes here... duh

//Punch classes
class Punch extends sprites.ExtendableSprite {
    damage: number
    knockback: number
    xOffset: number
    yOffset: number
    hitFirst: boolean
    alreadyHit: Sprite[]
    animationL: Image[]
    animationR: Image[]

    constructor(damage: number, knockback: number, animationL: Image[], animationR: Image[]) {
        super(img`.`, SpriteKind.Punch)
        this.damage = damage + punchDmgBonus
        this.knockback = knockback + punchKbBonus
        this.xOffset = randint(-4, 4)
        this.yOffset = randint(-4, 4)
        this.hitFirst = false
        this.alreadyHit = []
        this.lifespan = 360

        control.runInParallel(function() {
            this.setFlag(SpriteFlag.Ghost, true)
            pause(50)
            this.setFlag(SpriteFlag.Ghost, false)
        })

        let fixedAngle = angle

        if (fixedAngle > -180 && fixedAngle <= 0) {
            this.z = makeCodeMan.y - 1
        } else {
            this.z = makeCodeMan.y + 1
        }
        if (punchSide == 0) {
            control.runInParallel(function() {
                leftHand.setFlag(SpriteFlag.Invisible, true)
                if (melee == meleeAttacks.thunderclap) { rightHand.setFlag(SpriteFlag.Invisible, true) }
                punchSide = 1
                for (let image of animationL) {
                    this.setImage(image)
                    spriteFx.cloneSpriteImage(this, this)
                    spriteFx.setRotation(this, fixedAngle)
                    pause(45)
                }
                leftHand.setFlag(SpriteFlag.Invisible, false)
                if (melee == meleeAttacks.thunderclap) { rightHand.setFlag(SpriteFlag.Invisible, false) }
            })
        } else {
            control.runInParallel(function() {
                rightHand.setFlag(SpriteFlag.Invisible, true)
                if (melee == meleeAttacks.thunderclap) { leftHand.setFlag(SpriteFlag.Invisible, true) }
                punchSide = 0
                for (let image of animationR) {
                    this.setImage(image)
                    spriteFx.cloneSpriteImage(this, this)
                    spriteFx.setRotation(this, fixedAngle)
                    pause(45)
                }
                rightHand.setFlag(SpriteFlag.Invisible, false)
                if (melee == meleeAttacks.thunderclap) { leftHand.setFlag(SpriteFlag.Invisible, false) }
            })
        }
    }
    effect(enemy: Sprite) {}
}

class DefaultPunch extends Punch {
    constructor() {
        super(15, 110, assets.animation`punchDefaultL`, assets.animation`punchDefultR`)
    }
}

class IronFist extends Punch {
    constructor() {
        super(30, 160, assets.animation`ironFistL`, assets.animation`ironFistR`)
    }
}

class Thunderclap extends Punch {
    constructor() {
        super(60, 200, assets.animation`thunderclap`, assets.animation`thunderclap`)
    }
}

class NeedleArm extends Punch {
    constructor() {
        super(40, 150, assets.animation`needleArmL`, assets.animation`needleArmR`)
    }
}

class ExplodeOPunch extends Punch {
    constructor() {
        super(15, 110, assets.animation`explodeOPunchL`, assets.animation`explodeOPunchR`)
    }
    effect(enemy: Sprite) {
        if (Math.percentChance(50)) {
            let explosion = new ExplosionNormal
            explosion.setPosition(enemy.x, enemy.y)
        }
    }
}

class ClusterBlast extends Punch {
    constructor() {
        super(20, 120, assets.animation`clusterBlastL`, assets.animation`clusterBlastR`)
    }
    effect(enemy: Sprite) {
        if (Math.percentChance(65)) {
            let explosion = new ExplosionNormal
            explosion.setPosition(enemy.x, enemy.y)
            for (let i = 0; i < randint(4, 8); i ++) {
                let cluster = sprites.create(img`
                    ................
                    ................
                    ................
                    ................
                    ................
                    ................
                    ................
                    ................
                    ................
                    ................
                    ................
                    ................
                    ................
                    ................
                    ................
                    ................
                    ................
                    ................
                    ................
                    ................
                    ................
                    ................
                    ................
                    ................
                    ................
                    ................
                    ................
                    ................
                    ................
                    ................
                    ................
                    ................
                `, SpriteKind.Null)
                cluster.setPosition(enemy.x, enemy.y)
                cluster.z = cluster.y
                spriteutils.setVelocityAtAngle(cluster, spriteutils.degreesToRadians(randint(0, 360)), randint(50, 100))
                control.runInParallel(function() {
                    animation.runImageAnimation(cluster, assets.animation`clusterBomb`, 45, false)
                    pause(450)
                    let explosion = new ExplosionSmall
                    explosion.damage -= 10
                    explosion.setPosition(cluster.x, cluster.y)
                    sprites.destroy(cluster)
                })
                
            }
        }
    }
}

class BombBarrage extends Punch {
    constructor() {
        super(10, 50, assets.animation`bombBarrageL`, assets.animation`bombBarrageR`)
    }
    effect(enemy: Sprite) {
        let explosion = new ExplosionSmall
        explosion.setPosition(enemy.x, enemy.y)
    }
}

class Explosion extends sprites.ExtendableSprite {
    damage: number
    knockback: number
    alreadyHit: Sprite[]
    animation: Image[]

    constructor(damage: number, knockback: number, animation: Image[]) {
        super(animation[0], SpriteKind.Explosion)
        this.damage = damage + punchDmgBonus
        this.knockback = knockback + punchKbBonus
        this.alreadyHit = []
        this.z = 200
        this.lifespan = 360

        control.runInParallel(function() {
            for (let image of animation) {
                this.setImage(image)
                pause(45)
            }    
        })
    }
}

class ExplosionNormal extends Explosion {
    constructor() {
        super(35, 100, assets.animation`explosion`)
    }
}

class ExplosionSmall extends Explosion {
    constructor() {
        super(15, 40, assets.animation`explosionSmall`)
    }
}

//Laser classes
class Laser extends sprites.ExtendableSprite {
    damage: number
    knockback: number
    speed: number
    pierceCount: number
    radians: number
    fixedAngle: number
    hitFirst: boolean
    alreadyHit: Sprite[]
    animation: Image[]

    constructor(damage: number, knockback: number, speed: number, pierceCount: number, animation: Image[]) {
        super(animation[0], SpriteKind.Projectile)
        this.damage = damage + laserDmgBonus
        this.knockback = knockback + laserKbBonus
        this.pierceCount = pierceCount
        this.hitFirst = false
        this.alreadyHit = []
        this.setFlag(SpriteFlag.AutoDestroy, true)
        this.setPosition(makeCodeMan.x, makeCodeMan.y - 8)

        this.radians = spriteutils.angleFrom(this, cursor)
        this.fixedAngle = angle
        spriteutils.setVelocityAtAngle(this, this.radians, speed)
        spriteFx.setRotation(this, spriteutils.radiansToDegrees(this.radians))

        if (this.fixedAngle > -180 && this.fixedAngle <= 0) {
            this.z = makeCodeMan.y - 1
        } else {
            this.z = makeCodeMan.y + 1
        }
        control.runInParallel(function() {
            while (!spriteutils.isDestroyed(this)) {
                for (let image of animation) {
                    this.setImage(image)
                    spriteFx.cloneSpriteImage(this, this)
                    spriteFx.setRotation(this, spriteutils.radiansToDegrees(this.radians))
                    pause(45)
                }
            }
        })
    }
    behavior() {}
    effect(enemy: Sprite) {}
}

class DefaultLaser extends Laser {
    constructor() {
        super(12, 80, 450, 0, assets.animation`lasersDefault`)
    }
}

class Unibeam extends Laser {
    constructor() {
        super(25, 100, 600, 3, assets.animation`unibeam`)
    }
}

class Railgun extends Laser {
    segments: Sprite[]

    constructor() {
        super(60, 160, 0, 9999, assets.animation`railgun`)
        this.segments = []
        this.lifespan = 200
        for (let dist = 60; dist < 360; dist += 60) {
            let newLaser = new Laser(80, 110, 0, 9999, assets.animation`railgunSegment`)
            let radians = spriteutils.angleFrom(this, cursor)
            spriteutils.placeAngleFrom(newLaser, radians, dist, this)
            newLaser.lifespan = 200
            newLaser.alreadyHit = this.alreadyHit
            this.segments.push(newLaser)
        }
    }
}

class Incineration extends Laser {
    segments: Sprite[]
    
    constructor() {
        super(12, 40, 0, 9999, assets.animation`incineration`)
        this.segments = [this]
        for (let i = 0; i < 6; i ++) {
            let newLaser = new Laser(12, 40, 0, 9999, assets.animation`incinerationSegment`)
            newLaser.setFlag(SpriteFlag.AutoDestroy, false)
            newLaser.alreadyHit = this.alreadyHit
            this.segments.push(newLaser)
        }
    }
    behavior() {
        this.setPosition(makeCodeMan.x, makeCodeMan.y - 8)
        let radians = spriteutils.angleFrom(this, cursor)
        let fixedAngle = angle
        let dist = 0
        for (let segment of this.segments) {
            let laser = segment as Laser
            spriteutils.placeAngleFrom(laser, radians, dist, this)
            laser.radians = radians
            laser.fixedAngle = fixedAngle
            spriteFx.setRotation(laser, spriteutils.radiansToDegrees(laser.radians))
            if (laser.fixedAngle > -180 && laser.fixedAngle <= 0) {
                laser.z = makeCodeMan.y - 1
            } else {
                laser.z = makeCodeMan.y + 1
            }
            dist += 60
        }
    }
}

class Enemy extends sprites.ExtendableSprite {
    health: number
    acceleration: number
    topSpeed: number
    currentKb: number
    knockbackMult: number
    animation: Image[]
    deathAnim: Image[]
    
    constructor(health: number, acceleration: number, topSpeed: number, knockbackMult: number, animation: Image[], deathAnim: Image[]) {
        super(animation[0], SpriteKind.Enemy)
        this.health = health += globalHealthBoost
        this.acceleration = acceleration
        this.topSpeed = topSpeed
        this.currentKb = 0
        this.knockbackMult = knockbackMult -= globalKbBoost
        this.deathAnim = deathAnim
        let randomSide = randint(0, 3)
        
        switch(randomSide) {
            case 0: this.setPosition(randint(0, 257), -32); break
            case 1: this.setPosition(288, randint(0, 193)); break
            case 2: this.setPosition(randint(0, 257), 224); break
            case 3: this.setPosition(-32, randint(0, 193)); break
        }

        control.runInParallel(function() {
            while (this.health > 0) {
                for (let image of animation) {
                    this.setImage(image)
                    spriteFx.cloneSpriteImage(this, this)
                    if (this.x > makeCodeMan.x) {
                        spriteFx.flipHorizontal(this)
                    }
                    pause(200)
                }
            }
        })
    }
    behavior() {
        let angle = spriteutils.angleFrom(this, makeCodeMan)
        this.currentKb = Math.constrain(this.currentKb -= this.acceleration, 0, 10000)
        this.z = this.y
        this.vx += Math.cos(angle) * this.acceleration
        this.vy += Math.sin(angle) * this.acceleration
        let speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy)
        if (speed > this.topSpeed + this.currentKb) {
            this.vx = this.vx / speed * (this.topSpeed + this.currentKb)
            this.vy = this.vy / speed * (this.topSpeed + this.currentKb)
        }
    }
    hit(damage: number, knockback: number, angle: number) {
        let deathAnim = this.deathAnim
        this.health -= damage
        this.currentKb = knockback * this.knockbackMult
        this.vx += Math.cos(angle) * (knockback * this.knockbackMult)
        this.vy += Math.sin(angle) * (knockback * this.knockbackMult)
        if (this.health <= 0) {
            this.acceleration = 0
            this.fx = 350
            this.fy = 350
            this.setFlag(SpriteFlag.Ghost, true)
            control.runInParallel(function() {
                for (let image of deathAnim) {
                    this.setImage(image)
                    spriteFx.cloneSpriteImage(this, this)
                    if (this.x > makeCodeMan.x) {
                        spriteFx.flipHorizontal(this)
                    }
                    pause(90)
                }
                sprites.destroy(this)
            })
        }
        control.runInParallel(function() {
            this.setFlag(SpriteFlag.Invisible, true)
            pause(45)
            this.setFlag(SpriteFlag.Invisible, false)
        })
    }
}

class NormalEnemy extends Enemy {
    constructor() {
        super(85, randint(6, 12), randint(25, 30), 1, assets.animation`enemyNormal`, assets.animation`enemyNormalDeath`)
    }
}

class FastEnemy extends Enemy {
    constructor() {
        super(45, randint(8, 16), randint(70, 80), 2.5, assets.animation`enemyFast`, assets.animation`enemyFastDeath`)
    }
}

class ProjEnemy extends Enemy {
    timer: number
    constructor() {
        super(85, randint(4, 8), randint(15, 20), 1, assets.animation`enemyProj`, assets.animation`enemyProjDeath`)
        this.timer = 150
    }
    behavior() {
        super.behavior()
        if (this.timer <= 0) {
            let projectile = sprites.create(assets.image`enemyProjectile`, SpriteKind.Enemy)
            projectile.setFlag(SpriteFlag.AutoDestroy, true)
            projectile.setPosition(this.x, this.y)
            spriteutils.setVelocityAtAngle(projectile, spriteutils.angleFrom(this, makeCodeMan), 160)
            spriteFx.setRotation(projectile, spriteutils.radiansToDegrees(spriteutils.angleFrom(this, makeCodeMan)))
            this.timer = 150
        } else {
            this.timer -= 1
        }
    }
}

class TankyNormalEnemy extends Enemy {
    constructor() {
        super(235, randint(4, 8), randint(15, 20), 0.6, assets.animation`enemyTankyNormal`, assets.animation`enemyTankyNormalDeath`)
    }
}

class TankyFastEnemy extends Enemy {
    constructor() {
        super(90, randint(6, 12), randint(55, 65), 2, assets.animation`enemyTankyFast`, assets.animation`enemyFastDeath`)
    }
}

class TankyProjEnemy extends Enemy {
    timer: number
    constructor() {
        super(235, randint(3, 6), randint(10, 15), 1, assets.animation`enemyTankyProj`, assets.animation`enemyTankyProjDeath`)
        this.timer = 150
    }
    behavior() {
        super.behavior()
        if (this.timer <= 0) {
            let projectile = sprites.create(assets.image`enemyProjectile`, SpriteKind.Enemy)
            projectile.setFlag(SpriteFlag.AutoDestroy, true)
            projectile.setPosition(this.x, this.y)
            spriteutils.setVelocityAtAngle(projectile, spriteutils.angleFrom(this, makeCodeMan), 160)
            spriteFx.setRotation(projectile, spriteutils.radiansToDegrees(spriteutils.angleFrom(this, makeCodeMan)))
            this.timer = 150
        } else {
            this.timer -= 1
        }
    }
}

class Upgrade extends sprites.ExtendableSprite {
    meleeDmgBuff: number
    meleeAtkSpeBuff: number
    meleeKbBuff: number
    rangedDmgBuff: number
    rangedAtkSpeBuff: number
    rangedKbBuff: number
    healthBuff: number
    newMeleeAttack: number
    newRangedAttack: number
    xPos: number
    description: string
    icon: Image
    pic: Sprite
    text: Sprite

    constructor(meleeDmgBuff: number, meleeAtkSpeBuff: number, meleeKbBuff: number, rangedDmgBuff: number, rangedAtkSpeBuff: number, rangedKbBuff: number, healthBuff: number, newMeleeAttack: number, newRangedAttack: number, xPos: number, description: string, icon: Image) {
        super(assets.image`upgradeTemplate`, SpriteKind.Upgrade)
        if (wave % 5 == 0) {this.setImage(assets.image`upgradeTemplateEpic`)}
        this.meleeDmgBuff = meleeDmgBuff
        this.meleeAtkSpeBuff = meleeAtkSpeBuff
        this.meleeKbBuff = meleeKbBuff
        this.rangedDmgBuff = rangedDmgBuff
        this.rangedAtkSpeBuff = rangedAtkSpeBuff
        this.rangedKbBuff = rangedKbBuff
        this.healthBuff = healthBuff
        this.newMeleeAttack = newMeleeAttack
        this.newRangedAttack = newRangedAttack
        this.x = xPos
        this.z = 500
        let pic = sprites.create(icon, SpriteKind.Null)
        pic.setPosition(xPos, 56)
        pic.z = 501
        this.pic = pic
        let text = fancyText.create(description, 56, 0, customFont.ScriptScript_Round)
        text.setPosition(xPos, 120)
        text.z = 501
        this.text = text
    }

    apply() {
        punchDmgBonus += this.meleeDmgBuff
        punchAtkDelay = Math.constrain(punchAtkDelay - this.meleeAtkSpeBuff, 1, 999)
        punchKbBonus += this.meleeKbBuff
        laserDmgBonus += this.rangedDmgBuff
        laserAtkDelay = Math.constrain(laserAtkDelay - this.rangedAtkSpeBuff, 1, 999)
        laserKbBonus += this.rangedKbBuff
        for (let i = 0; i < this.healthBuff; i++) {
            maxHp += 1
            hp = Math.constrain(hp += 2, 0, maxHp)
            let hitPoint = sprites.create(assets.image`healthFull`, SpriteKind.Null)
            hitPoint.z = 999
            healthBar.push(hitPoint)
        }
        for (let i = 0; i < healthBar.length; i++) {
            if (i < hp) {
                healthBar[i].setImage(assets.image`healthFull`)
            } else {
                healthBar[i].setImage(assets.image`healthEmpty`)
            }
            healthBar[i].setPosition((i + 1) * 18 + 12, 12)
        }
        melee = this.newMeleeAttack
        ranged = this.newRangedAttack
    }
}
